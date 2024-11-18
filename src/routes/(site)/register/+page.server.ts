import { registerSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    register: async ({ locals, request }) => {
        const { formData, errors } = await validateData(await request.formData(), registerSchema)

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            })
        }
        const username = formData.username;
        const email = formData.email;
        const password = formData.password;
        const passwordConfirm = formData.passwordConfirm;

        try {
            await locals.pb.collection('users').create({ username, email, password, passwordConfirm });
            await locals.pb.collection('users').requestVerification(email);
            //TODO: add toast for more user feedback
        } catch (err) {
            console.log(err);
            throw error(500, 'Something went wrong');
        }
        throw redirect(303, '/login')
    }
};