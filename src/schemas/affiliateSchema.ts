import z from "zod";

export const affiliateSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
    platform: z.string(),
    contractType: z.string(),
    BonusAmount: z.union([z.number(), z.string()]).optional(),
    CPA: z.union([z.number(), z.string()]).optional(),
    RevShare: z.union([z.number(), z.string()]).optional(),
    Baseline: z.union([z.number(), z.string()]).optional(),
    status: z.string(),
    manager: z.string(),
});

export const affiliateUpdateFormSchema = affiliateSchema
    .pick({
        name: true,
        email: true,
        platform: true,
        status: true,
        contractType: true,
        BonusAmount: true,
        CPA: true,
        RevShare: true,
        Baseline: true,
    })
    .extend({
        name: z.string().min(1, "name is required"),
        email: z.string().email("email is invalid"),
        platform: z.string().min(1, "platform is required"),
        contractType: z.string().min(1, "contractType is required"),
    })
    .refine(
        (data) => {
            if (data.contractType === "CPA") {
                return Number(data.CPA) > 0 && Number(data.CPA) !== undefined;
            }
            return true;
        },
        {
            message: "CPA must be greater than 0",
            path: ["CPA"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "CPA") {
                return Number(data.RevShare) == 0;
            }
            return true;
        },
        {
            message: "Cannot set RevShare with Contract Type CPA",
            path: ["RevShare"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "RevShare") {
                return (
                    Number(data.RevShare) > 0 &&
                    Number(data.RevShare) !== undefined
                );
            }
            return true;
        },
        {
            message: "RevShare must be greater than 0",
            path: ["RevShare"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "RevShare") {
                return Number(data.CPA) == 0;
            }
            return true;
        },
        {
            message: "Cannot set CPA with Contract Type RevShare",
            path: ["CPA"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "Hybrid") {
                return Number(data.CPA) > 0 && Number(data.CPA) !== undefined;
            }
            return true;
        },
        {
            message: "CPA must be greater than 0",
            path: ["CPA"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "Hybrid") {
                return (
                    Number(data.RevShare) > 0 &&
                    Number(data.RevShare) !== undefined
                );
            }
            return true;
        },
        {
            message: "RevShare must be greater than 0",
            path: ["RevShare"],
        }
    );

export const affiliatesSchema = z.array(affiliateSchema);

export const affiliateFormSchema = affiliateSchema
    .pick({
        name: true,
        email: true,
        platform: true,
        contractType: true,
        BonusAmount: true,
        CPA: true,
        RevShare: true,
        Baseline: true,
    })
    .extend({
        name: z.string().min(1, "name is required"),
        email: z.string().email("email is invalid"),
        platform: z.string().min(1, "platform is required"),
        contractType: z.string().min(1, "contractType is required"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    })
    .refine(
        (data) => {
            if (data.contractType === "CPA") {
                return Number(data.CPA) > 0;
            }
            return true;
        },
        {
            message: "CPA must be greater than 0",
            path: ["CPA"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "RevShare") {
                return Number(data.RevShare) > 0;
            }
            return true;
        },
        {
            message: "RevShare must be greater than 0",
            path: ["RevShare"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "Hybrid") {
                return Number(data.CPA) > 0 && Number(data.RevShare) > 0;
            }
            return true;
        },
        {
            message: "CPA and Revshare must be greater than 0",
            path: ["RevShare", "CPA"],
        }
    );
