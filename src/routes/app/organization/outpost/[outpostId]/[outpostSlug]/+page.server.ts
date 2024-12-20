import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { generateOutpostSlug } from '$lib/utils';
import type { CommodityType, Job, Outpost, OutpostCommodity } from '$lib/pulsepointTypes';
import { requestCommoditySchema, updateOutpostSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';

export const load = (async ({ locals, params }) => {
	const { outpostId, outpostSlug } = params;

	const outpost = await locals.pb.collection<Outpost>('outposts').getOne(outpostId, {
		expand: 'star_system,planet,moon',
		fields: '*,expand.star_system.name,expand.planet.name,expand.moon.name'
	});

	if (!outpost) {
		throw redirect(303, '/not-found');
	}

	const expectedSlug = generateOutpostSlug(outpost.code, outpost.name);
	if (outpostSlug !== expectedSlug) {
		throw redirect(301, `/app/organization/outpost/${outpostId}/${expectedSlug}`);
	}

	const commodityTypes = await locals.pb.collection<CommodityType>('commodity_types').getFullList();

	const outpostCommodities = await locals.pb
		.collection<OutpostCommodity>('outpost_commodities')
		.getFullList({
			filter: `outpost="${outpostId}"`,
			expand: 'commodity'
		});

	return {
		user: locals.user,
		organization: locals.organization,
		outpost: outpost,
		commodityTypes: commodityTypes,
		outpostCommodities: outpostCommodities
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateOutpost: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), updateOutpostSchema);
		// Clean empty values
		Object.keys(formData).forEach((key) => formData[key] === '' && delete formData[key]);
		console.log(formData);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			const outpost = await locals.pb
				.collection<Outpost>('outposts')
				.update(formData.outpostId, formData);

			return {
				success: true,
				body: {
					outpost: outpost
				}
			};
		} catch (err) {
			console.log(err);

			if (err instanceof Error) {
				throw error(500, err.message);
			} else {
				throw error(500, 'Unknown error');
			}
		}
	},
	requestCommodity: async ({ locals, request }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			requestCommoditySchema
		);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			const job = await locals.pb.collection<Job>('jobs').create({
				organization: locals.organization.id,
				requestingOutpost: formData.outpostId,
				commodity: formData.commodityId,
				quantity: formData.quantity,
				status: 'Pending'
			});

			return {
				success: true,
				body: {
					job: job
				}
			};
		} catch (err) {
			console.log(err);

			if (err instanceof Error) {
				throw error(500, err.message);
			} else {
				throw error(500, 'Unknown error');
			}
		}
	}
};
