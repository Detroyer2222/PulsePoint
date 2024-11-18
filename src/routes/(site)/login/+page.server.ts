import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateData } from '$lib/utils';
import { loginSchema } from '$lib/schemas';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    login: async ({ locals, request }) => {
        const { formData, errors} = await validateData(await request.formData(), loginSchema)
        
        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            })
        }

        try {
            await locals.pb.collection('users').authWithPassword(formData.email, formData.password);
            if (!locals.pb.authStore.isValid) {
                locals.pb.authStore.clear();
                return {
                    notVerified: true,
                }
            }
        } catch (err) {
            const svelteError = err as { status: number; message: string };
            throw error(svelteError.status, svelteError.message)
        }
        throw redirect(303, '/app')
    }
};