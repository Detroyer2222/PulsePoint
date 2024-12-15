import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateData } from '$lib/utils';
import {
	addAdminsSchema,
	addMembersSchema,
	createOrganizationSchema,
	removeOutpostSchema,
	removeUserFromOrganizationSchema,
	updateOrganizationSchema
} from '$lib/schemas';
import type { Organization, Outpost } from '$lib/pulsepointTypes';

export const load = (async ({ locals, depends }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	depends('organization');

	if (locals.organization) {
		// load organization members, admins and owners
		const organizationExpanded = await locals.pb
			.collection<Organization>('organizations')
			.getOne(locals.organization.id, {
				expand: 'members,admins,owner',
				fields:
					'expand.members.username,expand.members.id,expand.admins.username,expand.admins.id,expand.owner.username,expand.owner.id'
			});
		const outposts = await locals.pb.collection<Outpost>('outposts').getFullList({
			filter: `organization="${locals.organization.id}"`,
			fields: 'id, code, name'
		});
		if (organizationExpanded.expand) {
			locals.organization.expand = organizationExpanded.expand;
			return {
				organization: locals.organization,
				outposts: outposts
			};
		}
	}

	return {
		organization: locals.organization
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createOrganization: async ({ locals, request }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			createOrganizationSchema
		);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			if (!locals.user) {
				throw error(401, 'Unauthorized');
			}
			const organization = await locals.pb.collection<Organization>('organizations').create({
				...formData,
				owner: [locals.user.id],
				admins: [locals.user.id],
				members: [locals.user.id]
			});

			if (organization) {
				locals.organization = organization;
			}
		} catch (err) {
			console.log(err);
			if (err instanceof Error) {
				throw error(500, err.message);
			} else {
				throw error(500, 'Unknown error');
			}
		}

		return {
			success: true
		};
	},
	updateOrganization: async ({ locals, request }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			updateOrganizationSchema
		);
		console.log('updateOrganization orgID', locals.organization.id);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			if (!locals.user) {
				throw error(401, 'Unauthorized');
			}
			const organization = await locals.pb
				.collection<Organization>('organizations')
				.update(locals.organization.id, formData);

			if (organization) {
				locals.organization = organization;
			}
		} catch (err) {
			console.log(err);
			if (err instanceof Error) {
				throw error(500, err.message);
			} else {
				throw error(500, 'Unknown error');
			}
		}

		return {
			success: true
		};
	},

	removeMember: async ({ locals, request }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			removeUserFromOrganizationSchema
		);
		console.log('removeMember orgID', locals.organization.id);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			if (formData.userId === locals.organization.owner) {
				return fail(400, {
					data: formData,
					errors: {
						userId: 'Owner cannot be removed from organization.'
					},
					isOwner: true
				});
			}

			const organization = await locals.pb.collection<Organization>('organizations').update(
				locals.organization.id,
				{
					'members-': [formData.userId]
				},
				{
					expand: 'members,admins,owner'
				}
			);

			locals.organization = organization;

			return {
				success: true
			};
		} catch (err) {
			console.log(err);
			if (err instanceof Error) {
				throw error(500, err.message);
			} else {
				throw error(500, 'Unknown error');
			}
		}
	},
	removeAdmin: async ({ locals, request }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			removeUserFromOrganizationSchema
		);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			if (formData.userId === locals.organization.owner) {
				return fail(400, {
					data: formData,
					errors: {
						userId: 'Owner cannot be removed from organization.'
					},
					isOwner: true
				});
			}

			const organizationAdmins = await locals.pb.collection<Organization>('organizations').update(
				locals.organization.id,
				{
					'admins-': [formData.userId]
				},
				{
					expand: 'members,admins,owner'
				}
			);

			if (organizationAdmins.expand) {
				locals.organization = organizationAdmins;
				return {
					success: true
				};
			}
		} catch (err) {
			console.log(err);
			if (err instanceof Error) {
				throw error(500, err.message);
			} else {
				throw error(500, 'Unknown error');
			}
		}
	},
	addMembers: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), addMembersSchema);
		console.log('locals organization', locals.organization);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		const usernames = formData.usernames.replace(/ /g, '').split(',');
		const newMembers: string[] = [];

		for (const username of usernames) {
			try {
				console.log('fetching user', username);
				const user = await locals.pb
					.collection('users')
					.getFirstListItem(`username="${username}"`, {
						fields: 'username,id'
					});

				if (user) {
					newMembers.push(user.id);
				}
			} catch (err) {
				console.error(`Error fetching user ${username}:`, err);
				throw error(500, 'Failed to add members to organization.');
			}
		}

		try {
			const organizationMembers = await locals.pb
				.collection<Organization>('organizations')
				.update(locals.organization.id, {
					'members+': newMembers,
					expand: 'members,admins,owner'
				});
			console.log('Organization members:', organizationMembers);

			if (organizationMembers.expand) {
				locals.organization = organizationMembers;

				return {
					success: true
				};
			}
		} catch (err) {
			console.error('Error updating organization members:', err);
			throw error(500, 'Failed to add members to organization.');
		}

		return { success: true };
	},
	addAdmins: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), addAdminsSchema);
		console.log('adding admins', errors, formData);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			const selectedUsers = JSON.parse(formData.selectedUsers);
			console.log('parsed', selectedUsers);
			const organizationAdmins = await locals.pb
				.collection<Organization>('organizations')
				.update(locals.organization.id, {
					'admins+': selectedUsers,
					expand: 'members,admins,owner'
				});

			if (organizationAdmins.expand) {
				locals.organization = organizationAdmins;

				return {
					success: true
				};
			}
		} catch (err) {
			console.error('Error updating organization admins:', err);
			throw error(500, 'Failed to add admins to organization.');
		}

		return { success: true };
	},
	removeOutpost: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), removeOutpostSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			const success = await locals.pb.collection<Outpost>('outposts').delete(formData.outpostId);

			if (success) {
				return {
					success: true
				};
			}
		} catch (err) {
			console.log(err);
			if (err instanceof Error) {
				throw error(500, err.message);
			} else {
				throw error(500, 'Unknown error');
			}
		}
	}
};
