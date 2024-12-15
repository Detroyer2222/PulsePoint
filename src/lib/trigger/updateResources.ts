import { logger, schedules } from "@trigger.dev/sdk/v3";
import PocketBase from 'pocketbase'

export const updateResources = schedules.task({
    id: "update-resources",
    maxDuration: 300, // Stop executing after 5 minutes
    cron: "0 */6 * * *", // Run every 2 hours
    run: async (payload: any, { ctx }) => {
        logger.info("Updating Resources has started", { timestamp: payload.timestamp });

        const apiUrl = process.env.UEX_API_URL;
        const apiKey = process.env.UEX_API_KEY;
        const pocketBaseUrl = process.env.PUBLIC_POCKETBASE_URL;
        const pocketBaseUser = process.env.PRIVATE_POCKETBASE_TRIGGER_USER;
        const pocketBasePassword = process.env.PRIVATE_POCKETBASE_TRIGGER_PASSWORD;

        if (!apiUrl || !apiKey || !pocketBaseUrl || !pocketBaseUser || !pocketBasePassword) {
            logger.error("Missing required environment variables");
            return {
                success: false,
                error: "Missing required environment variables",
            };
        }

        logger.debug("Environment variables loaded", { apiUrl, pocketBaseUrl, pocketBaseUser });

        try {
            // Fetch data from the API
            const uexResponse = await fetch(`${apiUrl}/commodities`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
            });

            if (!uexResponse.ok) {
                throw new Error(`API fetch failed with status ${uexResponse.status}`);
            }

            const uexData = await uexResponse.json();
            logger.info("Fetched data from UEX API", { data: uexData });
            logger.debug(`Found ${uexData.data.length} commodities`);

            const pb = new PocketBase(pocketBaseUrl);
            const authData = await pb.collection('_superusers').authWithPassword(
                `${pocketBaseUser}`,
                `${pocketBasePassword}`,
            );

            if (pb.authStore.isValid) {
                logger.info("PocketBase authentication successful", { authData });
            }
            else {
                logger.error("PocketBase authentication failed");
                throw new Error("PocketBase authentication failed");
            }

            const batch = pb.createBatch();

            for (const commodity of uexData.data) {
                if (commodity.is_available_live === 0 || commodity.is_temporary === 1 || commodity.is_sellable === 0) {
                    logger.debug("Commodity is not relevant", { name: commodity.name });
                    continue;
                }

                if (commodity.is_temporary === 0 && commodity.price_sell == 0) {
                    logger.debug("Commodity is not relevant", { name: commodity.name });
                    continue;
                }

                if (commodity.name.toLowerCase().includes("year of the")) {
                    logger.debug("Commodity is not relevant", { name: commodity.name });
                    continue;
                }

                if (commodity.is_havestable === 1) {
                    logger.debug("Commodity is not relevant", { name: commodity.name });
                    continue;
                }

                const { price_buy, price_sell, is_illegal }: { price_buy: number, price_sell: number, is_illegal: boolean } = commodity;
                let name: string = commodity.name;
                let type: string = commodity.kind;
                let code: string = commodity.code;

                logger.debug("Processing commodity", { name, code, type, price_buy, price_sell, is_illegal });
                if (name.toLowerCase().includes("ore")) {
                    logger.debug("Commodity is an ore", { name, type });
                    type = "Ore";
                }

                if (name.toLowerCase().includes("raw")) {
                    logger.debug("Commodity is raw", { name, type });
                    type = "Raw";
                }

                try {
                    logger.debug("Fetching existing commodity", { code });
                    // Correct the query syntax and use adjusted variables
                    const existingCommodity = await pb.collection('commodities').getFirstListItem(
                        `(code="${code}" && name="${name}")`,
                        { fields: 'id' }
                    );
                    logger.debug("Existing commodity found", { name, code, type, price_buy, price_sell, is_illegal });

                    batch.collection('commodities').update(existingCommodity.id, {
                        name,
                        code,
                        type,
                        price_buy,
                        price_sell,
                        is_illegal,
                    });
                    logger.info("Batch update added", { name, code });
                } catch (error) {
                    logger.debug("Creating new commodity", { name, code, type, price_buy, price_sell, is_illegal });
                    // Add the create operation to the batch
                    batch.collection('commodities').create({
                        name,
                        code,
                        type,
                        price_buy,
                        price_sell,
                        is_illegal,
                    });
                    logger.debug("Batch create added", { name, code });
                }
            }

            const pocketBaseBatchResponse = await batch.send();

            for (const batchResponse of pocketBaseBatchResponse) {
                if (batchResponse.status !== 200) {
                    logger.error("PocketBase batch request failed", { status: batchResponse.status, body: await batchResponse.body });
                    throw new Error(`PocketBase batch request failed with status ${batchResponse.status}`);
                } else {
                    logger.info("PocketBase batch request successful", { status: batchResponse.status, body: await batchResponse.body });
                }
            }

            return {
                success: true,
                message: "Resources updated successfully",
            };
        } catch (error: any) {
            logger.error("An error occurred while updating resources", { error: error.message });
            throw new Error(error.message);
        }
    },
});
