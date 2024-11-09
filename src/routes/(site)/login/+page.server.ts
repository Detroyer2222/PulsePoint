import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    login: async ({ locals, request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        console.log('email', email);
        console.log('password', password);

        try {
            await locals.pb.collection('users').authWithPassword(email, password);
            if (!locals.pb.authStore.isValid) {
                locals.pb.authStore.clear();
                return {
                    notVerified: true,
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
                throw error(500, 'Something went wrong');
            } else {
                console.log('Unknown error', err);
                throw error(500, 'Something went wrong');
            }
        }
        throw redirect(303, '/app')
    }
};