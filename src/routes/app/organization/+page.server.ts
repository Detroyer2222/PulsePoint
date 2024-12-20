import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Outpost } from '$lib/pulsepointTypes';
import { validateData } from '$lib/utils';
import { addOutpostSchema } from '$lib/schemas';

export const load = (async ({ locals }) => {
	if (!locals.organization) {
		throw redirect(303, '/app/dashboard');
	}

	const outposts = await locals.pb.collection<Outpost>('outposts').getFullList({
		filter: `organization="${locals.organization.id}"`,
		expand: 'star_system, planet, moon',
		fields: `id, code, name, image, expand.star_system.name, expand.planet.name, expand.moon.name`
	});

	const starSystems = await locals.pb.collection('star_systems').getFullList({
		fields: 'id, name'
	});

	return {
		organization: locals.organization,
		outposts: outposts,
		starSystems: starSystems,
		token: locals.pb.authStore.token
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	addOutpost: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), addOutpostSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			const outpost = await locals.pb.collection<Outpost>('outposts').create({
				name: formData.name,
				code: formData.code,
				description: formData.description,
				image: formData.image,
				organization: locals.organization.id,
				star_system: formData.starSystem,
				planet: formData.planet,
				moon: formData.moon,
				lattitude: formData.lat,
				longitude: formData.lng
			});

			return {
				success: true,
				outpost: outpost
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