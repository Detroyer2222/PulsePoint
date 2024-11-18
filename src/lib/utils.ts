import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
import type { ZodError, ZodObject, ZodSchema } from "zod";
import type { ActionData } from "../routes/$types";

export const validateData = async (formData: FormData, schema: ZodSchema) => {
    const body = Object.fromEntries(formData);

    try {
        const data = schema.parse(body);
        return {
            formData: data,
            errors: null,
        }
    } catch (err) {
        console.log(err);
        // @ts-ignore
        const errors = err.flatten();

        return {
            formData: body,
            errors,
        }
    }
}

export const toggleTheme = (isDarkMode:boolean) => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    }
    else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    }
}

export const getImageUrlFromPocketBase = (collectionId: string, recordId: string, filename: string, size = '0x0'): string => {
    return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${filename}?thumb=${size}`;
}