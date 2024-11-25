import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { findUserOrganization } from '$lib/utils';

export const load = (async ({ locals }) => {
    if (!locals.pb.authStore.isValid) {
        throw redirect(303, '/login');
    }

    if (locals.organization) {
        return {
            organization: locals.organization,
        }
    }
    return {
        organization: undefined,
    };
}) satisfies LayoutServerLoad;