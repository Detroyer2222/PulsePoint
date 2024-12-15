import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { ZodError, ZodSchema } from 'zod';
import PocketBase from 'pocketbase';
import type { Organization } from './pulsepointTypes';
import { error } from '@sveltejs/kit';

export const validateData = async (formData: FormData, schema: ZodSchema) => {
	const body = Object.fromEntries(formData);

	try {
		const data = schema.parse(body);
		return {
			formData: data,
			errors: null
		};
	} catch (err) {
		console.log(err);

		const errors = (err as ZodError).flatten();

		return {
			formData: body,
			errors
		};
	}
};

export const toggleTheme = (isDarkMode: boolean) => {
	if (isDarkMode) {
		document.documentElement.classList.add('dark');
		localStorage.setItem('color-theme', 'dark');
	} else {
		document.documentElement.classList.remove('dark');
		localStorage.setItem('color-theme', 'light');
	}
};

export const getImageUrlFromPocketBase = (
	collectionId: string,
	recordId: string,
	filename: string,
	size = '0x0'
): string | null => {
	if (!filename) {
		return null;
	}

	return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${filename}?thumb=${size}`;
};

export const findUserOrganization = async (
	userId: string,
	pb: PocketBase
): Promise<Organization | null> => {
	try {
		const organizations = await pb.collection<Organization>('organizations').getFullList({
			filter: `members.id ?= "${userId}"`
			//expand: 'members'
		});

		if (!organizations) {
			return null;
		}

		return organizations[0] as Organization;
	} catch (err) {
		console.log(err);

		if (err instanceof Error) {
			throw error(500, err.message);
		} else {
			throw error(500, 'Unknown error');
		}
	}
};

export const generateOutpostSlug = (outpostCode: string, outpostName: string): string => {
	return `${outpostCode}-${outpostName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
};
