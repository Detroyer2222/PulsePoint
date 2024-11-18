import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    locals.pb.authStore.clear();
    locals.user = null;
    
    redirect(303, '/login');
}) satisfies PageServerLoad;