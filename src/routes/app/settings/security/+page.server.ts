import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateData } from '$lib/utils';
import { updateEmailSchema, updatePasswordSchema } from '$lib/schemas';

export const load = (async ({ locals }) => {
    if (!locals.pb.authStore.isValid){
        throw redirect(303, '/login');
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    updateEmail: async ({ locals, request }) => {
        const { formData, errors } = await validateData(await request.formData(), updateEmailSchema);
        
        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            });
        }

        try {
            await locals.pb.collection('users').requestEmailChange(formData.email);
            
        } catch (err) {
            console.log(err);
            throw error(500, 'An error occurred while updating your email address');
            
        }

        return {
            success: true,
            emailChanged: true
        };
    },

    updatePassword: async ({ locals, request }) => {
        const { formData, errors } = await validateData(await request.formData(), updatePasswordSchema);

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            });
        }

        try {
            const userId = locals.user?.id;
            if (!userId) {
                throw error(400, 'User ID is missing');
            }
            await locals.pb.collection('users').update(userId, formData);
            locals.pb.authStore.clear();
        } catch (err) {
            console.log(err);
            error(500, 'An error occurred while updating your password');
        }

        redirect(303, '/login');
    }
};