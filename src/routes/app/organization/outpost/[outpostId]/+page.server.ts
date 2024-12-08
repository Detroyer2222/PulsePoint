import type { Outpost } from '$lib/pulsepointTypes';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { generateOutpostSlug } from '$lib/utils';

export const load = (async ({ locals, params }) => {
	const outpostId = params.outpostId;

	const outpost = await locals.pb.collection<Outpost>('outposts').getOne(outpostId, {
		filter: `organization="${locals.organization.id}"`,
		fields: 'code,name'
	});

	if (!outpost) {
		throw redirect(303, '/not-found');
	}

	const outpostSlug = generateOutpostSlug(outpost.code, outpost.name);

	throw redirect(301, `/app/organization/outpost/${outpostId}/${outpostSlug}`);
}) satisfies PageServerLoad;
