import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { generateOutpostSlug } from '$lib/utils';

export const load = (async ({ locals, params }) => {
	const { outpostId, outpostSlug } = params;

	const outpost = await locals.pb.collection('outposts').getOne(outpostId, {
		expand: 'star_system, planet, moon'
	});

	if (!outpost) {
		throw redirect(303, '/not-found');
	}

	const expectedSlug = generateOutpostSlug(outpost.code, outpost.name);
	if (outpostSlug !== expectedSlug) {
		throw redirect(301, `/app/organization/outpost/${outpostId}/${expectedSlug}`);
	}

	return {
		user: locals.user,
		organization: locals.organization,
		outpost: outpost
	};
}) satisfies PageServerLoad;
