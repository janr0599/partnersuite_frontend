import { authenticatedUserSchema, baseAuthSchema } from "./authSchemas";

export const userProfileSchema = authenticatedUserSchema.pick({
    name: true,
    email: true,
});

export const changePasswordSchema = baseAuthSchema
    .pick({
        currentPassword: true,
        password: true,
        confirmPassword: true,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
