import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required.' })
        .email({ message: 'Email must be a valid email address.' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8),
});

export const registerSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .regex(/^[a-zA-Z\s]*$/, { message: 'Username can only contain letters and spaces.' })
        .min(3, { message: 'Username must be at least 3 characters long.' })
        .max(64, { message: 'Username must be less than 64 characters.' })
        .trim(),
    email: z
        .string({ required_error: 'Email is required.' })
        .email({ message: 'Email must be a valid email address.' }),
    password: z
        .string({ required_error: 'Password is required' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
            message:
                'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
        }),
    passwordConfirm: z
        .string({ required_error: 'Password is required' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
            message:
                'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
        })

}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['password']
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['passwordConfirm']
        });
    }
});

export const updateEmailSchema = z.object({
    email: z
        .string({ required_error: 'Email is required.' })
        .email({ message: 'Email must be a valid email address.' }),
});

export const updatePasswordSchema = z.object({
    password: z
        .string({ required_error: 'Password is required' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
            message:
                'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
        }),
    passwordConfirm: z
        .string({ required_error: 'Password is required' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
            message:
                'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
        })

}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['password']
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password & Confirm password must match',
            path: ['passwordConfirm']
        });
    }
});

export const updateUsernameSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .regex(/^[a-zA-Z\s]*$/, { message: 'Username can only contain letters and spaces.' })
        .min(3, { message: 'Username must be at least 3 characters long.' })
        .max(64, { message: 'Username must be less than 64 characters.' })
        .trim(),
});

export const updateProfileSchema = z.object({
    avatar: z
        .instanceof(Blob)
        .optional()
        .superRefine((value, ctx) => {
            if (value) {
                if (value.size > 5242880) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'File size must be less than 5MB',
                        path: ['avatar']
                    });
                }
            }
        })
});

export const createOrganizationSchema = z.object({
    name: z
        .string({ required_error: 'Organization name is required' })
        .min(3, { message: 'Organization name must be at least 3 characters long.' })
        .max(64, { message: 'Organization name must be less than 64 characters.' })
        .trim(),
    description: z
        .string()
        .max(255, { message: 'Description must be less than 255 characters.' })
        .trim()
        .optional(),
    logo: z
        .instanceof(Blob)
        .optional()
        .superRefine((value, ctx) => {
            if (value) {
                if (value.size > 5242880) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'File size must be less than 5MB',
                        path: ['avatar']
                    });
                }
            }
        })
});

export const updateOrganizationSchema = z.object({
    description: z
        .string()
        .max(255, { message: 'Description must be less than 255 characters.' })
        .trim()
        .optional(),
    logo: z
        .instanceof(Blob)
        .optional()
        .superRefine((value, ctx) => {
            if (value) {
                if (value.size > 5242880) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'File size must be less than 5MB',
                        path: ['avatar']
                    });
                }
            }
        })
});

export const removeUserFromOrganizationSchema = z.object({
    userId: z.string({ required_error: 'User ID is required' }),
});

export const addMembersSchema = z.object({
    usernames: z.string({ required_error: 'Usernames are required' }),
});