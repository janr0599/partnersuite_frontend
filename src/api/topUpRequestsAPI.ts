import api from "@/lib/axios";
import { topUpRequestsSchema } from "@/schemas/topUpRequestsSchemas";
import { TopUpRequestAPI, TopUpRequests } from "@/types/topUpRequestsTypes";
import { isAxiosError } from "axios";

export const getTopUpRequests = async (): Promise<TopUpRequests> => {
    try {
        const { data } = await api.get<{ topUpRequests: TopUpRequests }>(
            "/topUpRequests"
        );
        const validation = topUpRequestsSchema.safeParse(data.topUpRequests);
        if (!validation.success) {
            console.error(
                "getTopUpRequests data validation failed:",
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

export const createTopUpRequest = async () => {
    try {
        const { data } = await api.post<{ message: string }>("/topUpRequests");
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const updateTopUpRequestStatus = async ({
    topUpRequestId,
    status,
}: Pick<TopUpRequestAPI, "topUpRequestId" | "status">) => {
    try {
        const { data } = await api.patch<{ message: string }>(
            `/topUpRequests/${topUpRequestId}`,
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

export const deleteTopUpRequest = async ({
    topUpRequestId,
}: Pick<TopUpRequestAPI, "topUpRequestId">) => {
    try {
        const { data } = await api.delete<{ message: string }>(
            `/topUpRequests/${topUpRequestId}`
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};
