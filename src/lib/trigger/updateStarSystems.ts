import type { Moon, Planet, StarSystem } from "$lib/pulsepointTypes";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import PocketBase, { type RecordModel } from 'pocketbase'

export const updateStarSystems = schedules.task({
    id: "update-star-systems",
    maxDuration: 300, // Stop executing after 5 minutes
    cron: "0 */6 */2 * *", // Run every 2 hours
    run: async (payload: any, { ctx }) => {
        logger.info("Updating Star Systems has started", { timestamp: payload.timestamp });

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

        try {
            // Fetch data from the API
            const uexResponse = await fetch(`${apiUrl}/star_systems`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
            });

            const uexData = await uexResponse.json();
            logger.info("Fetched data from UEX API", { data: uexData });

            let systems: any[] = [];
            for (const system of uexData.data) {
                if (system.is_available === 1 && system.is_visible === 1) {
                    logger.debug(`Adding star system ${system.name}`);
                    systems.push(system);
                }
            }

            for (const uexSystem of systems) {
                let pulsePointSystem: StarSystem;
                // Update Star System
                try {
                    logger.debug(`Fetching existing star system ${uexSystem.name}`);
                    const existingSystem = await pb.collection<StarSystem>('star_systems').getFirstListItem(`code="${uexSystem.code}"`, {
                        fields: "id, code"
                    });

                    logger.debug(`Updating star system ${uexSystem.name}`);
                    const response = await pb.collection<StarSystem>('star_systems').update(existingSystem.id, {
                        name: uexSystem.name,
                        code: uexSystem.code,
                        jurisdiction: uexSystem.jurisdiction_name,
                        faction: uexSystem.faction_name
                    }, { fields: "id, code" });
                    pulsePointSystem = response as StarSystem;

                } catch (error) {
                    logger.debug(`Creating star system ${uexSystem.name}`);
                    const response = await pb.collection<StarSystem>('star_systems').create({
                        name: uexSystem.name,
                        code: uexSystem.code,
                        jurisdiction: uexSystem.jurisdiction_name,
                        faction: uexSystem.faction_name
                    }, { fields: "id, code" });
                    pulsePointSystem = response as StarSystem;
                }

                logger.info(`Star system ${pulsePointSystem.name} updated`, { pulsePointSystem });

                // Update Planets
                const planetsResponse = await fetch(`${apiUrl}/planets?id_star_system=${uexSystem.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                });

                const uexPlanets = await planetsResponse.json();
                for (const uexPlanet of uexPlanets.data) {
                    let pulsePointPlanet: Planet;
                    try {
                        logger.debug(`Fetching existing planet ${uexPlanet.name}`);
                        const existingPlanet = await pb.collection<Planet>('planets').getFirstListItem(`code="${uexPlanet.code}"`, {
                            fields: "id, code"
                        });

                        logger.debug(`Updating planet ${uexPlanet.name}`);
                        const response = await pb.collection<Planet>('planets').update(existingPlanet.id, {
                            name: uexPlanet.name,
                            code: uexPlanet.code,
                            star_system: pulsePointSystem.id,
                            jurisdiction: uexPlanet.jurisdiction_name,
                            faction: uexPlanet.faction_name
                        }, { fields: "id, code" });
                        pulsePointPlanet = response;

                    } catch (error) {
                        logger.debug(`Creating planet ${uexPlanet.name}`);
                        const response = await pb.collection<Planet>('planets').create({
                            name: uexPlanet.name,
                            code: uexPlanet.code,
                            star_system: pulsePointSystem.id,
                            jurisdiction: uexPlanet.jurisdiction_name,
                            faction: uexPlanet.faction_name
                        }, { fields: "id, code" });
                        pulsePointPlanet = response;
                    }

                    logger.info(`Planet ${pulsePointPlanet.name} updated`, { pulsePointPlanet });

                    //Update Moons
                    const moonsResponse = await fetch(`${apiUrl}/moons?id_planet=${uexPlanet.id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`,
                        },
                    });

                    const uexMoons = await moonsResponse.json();

                    for (const uexMoon of uexMoons.data) {
                        try {
                            logger.debug(`Fetching existing moon ${uexMoon.name}`);
                            const existingMoon = await pb.collection<Moon>('moons').getFirstListItem(`code="${uexMoon.code}"`, {
                                fields: "id, code"
                            });

                            logger.debug(`Updating moon ${uexMoon.name}`);
                            const response = await pb.collection<Moon>('moons').update(existingMoon.id, {
                                name: uexMoon.name,
                                code: uexMoon.code,
                                planet: pulsePointPlanet.id,
                                jurisdiction: uexMoon.jurisdiction_name,
                                faction: uexMoon.faction_name
                            }, { fields: "id, code" });
                            logger.info(`Moon ${response.name} created`, { response });

                        } catch (error) {
                            logger.debug(`Creating moon ${uexMoon.name}`);
                            const response = await pb.collection<Moon>('moons').create({
                                name: uexMoon.name,
                                code: uexMoon.code,
                                planet: pulsePointPlanet.id,
                                jurisdiction: uexMoon.jurisdiction_name,
                                faction: uexMoon.faction_name
                            }, { fields: "id, code" });
                            logger.info(`Moon ${response.name} updated`, { response });
                        }
                    }
                }

                // Updating Space Stations
                const stationsResponse = await fetch(`${apiUrl}/space_stations?id_star_system=${uexSystem.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                });

                const uexStations = await stationsResponse.json();
                for (const uexStation of uexStations.data) {
                    try {
                        logger.debug(`Fetching existing space station ${uexStation.name}`);
                        const existingStation = await pb.collection('space_stations').getFirstListItem(`code="${uexStation.code}"`, {
                            fields: "id, code"
                        });

                        logger.debug(`Updating space station ${uexStation.name}`);
                        let planet: Planet | null = null;
                        let moon: Moon | null = null;

                        if (uexStation.planet_name != null) {
                            planet = await pb.collection<Planet>('planets').getFirstListItem(`name="${uexStation.planet_name}"`, { fields: "id" });
                        }
                        if (uexStation.moon_name != null) {
                            moon = await pb.collection<Moon>('moons').getFirstListItem(`name="${uexStation.moon_name}"`, { fields: "id" });
                        }

                        await pb.collection('space_stations').update(existingStation.id, {
                            name: uexStation.name,
                            code: uexStation.code,
                            jurisdiction: uexStation.jurisdiction_name,
                            faction: uexStation.faction_name,
                            has_terminal: uexStation.has_trade_terminal,
                            has_refinery: uexStation.has_refinery,
                            star_system: pulsePointSystem.id,
                            planet: planet ? planet.id : null,
                            moon: moon ? moon.id : null,
                            orbit: uexStation.orbit_name ? uexStation.orbit_name : null,
                            is_lagrange: uexStation.is_lagrange,
                        }, { fields: "id, code" });

                    } catch (error) {
                        logger.debug(`Creating space station ${uexStation.name}`);
                        let planet: Planet | null = null;
                        let moon: Moon | null = null;

                        if (uexStation.planet_name != null) {
                            planet = await pb.collection<Planet>('planets').getFirstListItem(`name="${uexStation.planet_name}"`, { fields: "id" });
                        }
                        if (uexStation.moon_name != null) {
                            moon = await pb.collection<Moon>('moons').getFirstListItem(`name="${uexStation.moon_name}"`, { fields: "id" });
                        }

                        await pb.collection('space_stations').create({
                            name: uexStation.name,
                            code: uexStation.code,
                            pad_types: uexStation.pad_types,
                            jurisdiction: uexStation.jurisdiction_name,
                            faction: uexStation.faction_name,
                            has_terminal: uexStation.has_trade_terminal,
                            has_refinery: uexStation.has_refinery,
                            star_system: pulsePointSystem.id,
                            planet: planet ? planet.id : null,
                            moon: moon ? moon.id : null,
                            orbit: uexStation.orbit_name ? uexStation.orbit_name : null,
                            is_lagrange: uexStation.is_lagrange,
                        }, { fields: "id, code" });
                    }
                }
            }
        } catch (error: any) {
            logger.error("Error updating star systems", { error });
            throw new Error("Error updating star systems", error.message);
        }
    }
});