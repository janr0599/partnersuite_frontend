import z from "zod";
import {
    affiliateFormSchema,
    affiliateSchema,
    affiliatesSchema,
} from "@/schemas/affiliateSchema";

export type Affiliate = z.infer<typeof affiliateSchema>;
export type Affiliates = z.infer<typeof affiliatesSchema>;
export type AffiliateFormData = z.infer<typeof affiliateFormSchema>;
export type AffiliateAPIType = {
    affiliateId: Affiliate["_id"];
    formData: Omit<AffiliateFormData, "password" | "confirmPassword">;
};
