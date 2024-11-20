import z from "zod";
import {
    affiliateFormSchema,
    affiliateSchema,
    affiliatesSchema,
    affiliateUpdateFormSchema,
} from "@/schemas/affiliateSchema";

export type Affiliate = z.infer<typeof affiliateSchema>;
export type Affiliates = z.infer<typeof affiliatesSchema>;
export type AffiliateFormData = z.infer<typeof affiliateFormSchema>;
export type AffiliateAPIType = {
    affiliateId: Affiliate["_id"];
    formData: Omit<AffiliateFormData, "password" | "confirmPassword">;
    status: Affiliate["status"];
};
export type AffiliateUpdateFormData = z.infer<typeof affiliateUpdateFormSchema>;
