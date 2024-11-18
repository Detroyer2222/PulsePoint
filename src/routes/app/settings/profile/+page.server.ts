import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { updateUsernameSchema, updateProfileSchema } from '$lib/schemas';
import { validateData } from '$lib/utils';

export const load = (async ({ locals }) => {
    if (!locals.pb.authStore.isValid) {
        throw redirect(303, '/login');
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    updateProfile: async ({ request, locals }) => {
        const { formData, errors } = await validateData(await request.formData(), updateProfileSchema);

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors,
            });
        }

        if (formData.avatar.size === 0) {
            formData.delete('avatar');
        }

        try {
            const userId = locals.user?.id;
            if (!userId) {
                throw error(401, 'Unauthorized');
            }
            const { avatar } = await locals.pb.collection('users').update(userId, formData)

            if (locals.user) {
                locals.user.avatar = avatar;
            }
        } catch (err) {
            console.log(err);
            throw error(400, 'Something went wrong updating your profile picture');
        }

        return {
            success: true,
        };
    },

    updateUsername: async ({ request, locals }) => {
        const { formData, errors } = await validateData(await request.formData(), updateUsernameSchema);

        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors,
            });
        }

        try {
            await locals.pb.collection('users').getFirstListItem(`username = "${formData.username}"`);
        } catch (err) {
            // @ts-ignore
            if (err.status === 404) {
                try {
                    const userId = locals.user?.id;
                    if (!userId) {
                        throw error(401, 'Unauthorized');
                    }
                    const { name } = await locals.pb.collection('users').update(userId, { username: formData.username });
                    if (locals.user) {
                        locals.user.username = name;
                    }
                    return {
                        usernameChange: true,
                        success: true,
                    };
                } catch (err) {
                    console.log(err);
                    // @ts-ignore
                    throw error(err.status, 'Something went wrong updating your username');

                }
            }
            console.log(err);
            // @ts-ignore
            throw error(err.status, 'Something went wrong updating your username');
        }

        return {
            usernameExists: true,
            success: true,
        };
    }
};