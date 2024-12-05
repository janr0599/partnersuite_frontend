import api from "@/lib/axios";
import { affiliateSchema, affiliatesSchema } from "@/schemas/affiliateSchema";
import {
    Affiliate,
    AffiliateAPIType,
    AffiliateFormData,
    Affiliates,
} from "@/types/affiliateTypes";
import { isAxiosError } from "axios";

export const addAffiliate = async (formData: AffiliateFormData) => {
    try {
        const { data } = await api.post<{ message: string }>(
            "/affiliates",
            formData
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const getAffiliates = async (): Promise<Affiliates> => {
    try {
        const { data } = await api.get<{ affiliates: Affiliates }>(
            "/affiliates"
        );
        const validation = affiliatesSchema.safeParse(data.affiliates);
        if (!validation.success) {
            console.error(
                "getAffiliates data validation failed:",
                validation.error.errors
            );
            throw new Error("Invalid data");
        }
        return validation.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const getAffiliateById = async (id: Affiliate["_id"]) => {
    try {
        const { data } = await api.get<{ affiliate: Affiliate }>(
            `/affiliates/${id}`
        );
        const validation = affiliateSchema.safeParse(data.affiliate);
        if (!validation.success) {
            console.error(
                "getAffiliateById data validation failed:",
                validation.error.errors
            );
            throw new Error("Invalid data");
        }
        return validation.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const updateAffiliate = async ({
    affiliateId,
    formData,
}: Pick<AffiliateAPIType, "affiliateId" | "formData">) => {
    try {
        const { data } = await api.put<{ message: string }>(
            `/affiliates/${affiliateId}`,
            formData
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const updateAffiliateStatus = async ({
    affiliateId,
    status,
}: Pick<AffiliateAPIType, "affiliateId" | "status">) => {
    try {
        const { data } = await api.patch<{ message: string }>(
            `/affiliates/${affiliateId}/status`,
            { status }
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const deleteAffiliate = async ({
    affiliateId,
}: Pick<AffiliateAPIType, "affiliateId">) => {
    try {
        const { data } = await api.delete<{ message: string }>(
            `/affiliates/${affiliateId}`
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};
