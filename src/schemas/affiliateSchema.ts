import z from "zod";

export const affiliateSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
    platform: z.string(),
    contractType: z.string(),
    CPA: z.number(),
    RevShare: z.number(),
    manager: z.string(),
});

export const affiliatesSchema = z.array(affiliateSchema);

export const affiliateFormSchema = affiliateSchema
    .pick({
        name: true,
        email: true,
        platform: true,
        contractType: true,
        CPA: true,
        RevShare: true,
    })
    .extend({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["password", "confirmPassword"],
        message: "Passwords do not match",
    });
