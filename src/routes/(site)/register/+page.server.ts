import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

 export const actions: Actions = {
    register: async ({ locals, request }) => {
        const formData = await request.formData();
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const passwordConfirm = formData.get('passwordConfirm') as string;
        
        try {
            await locals.pb.collection('users').create({ username, email, password, passwordConfirm });
            await locals.pb.collection('users').requestVerification(email);
            //TODO: add toast for more user feedback
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
                throw error(500, 'Something went wrong');
            } else {
                console.log('Unknown error', err);
                throw error(500, 'Something went wrong');
            }
        }
        throw redirect(303, '/login')
    }
};