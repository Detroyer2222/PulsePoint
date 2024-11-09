import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    resetPassword: async ({ request, locals}) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        try {
            await locals.pb.collection('users').requestPasswordReset(email);
            return {
                success: true,
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
        throw redirect(303, '/home')
    }
};