import api from "@/lib/axios";
import {
    topUpRequestSchema,
    topUpRequestsSchema,
} from "@/schemas/topUpRequestsSchemas";
import {
    TopUpRequest,
    TopUpRequestAPI,
    TopUpRequests,
} from "@/types/topUpRequestsTypes";
import { isAxiosError } from "axios";

export const getTopUpRequests = async (): Promise<TopUpRequests> => {
    try {
        const { data } = await api.get<{ topUpRequests: TopUpRequests }>(
            "/topUpRequests"
        );
        console.log(data.topUpRequests);
        const validation = topUpRequestsSchema.safeParse(data.topUpRequests);
        if (!validation.success) {
            console.error(
                "getTopUpRequests data validation failed:",
                validation.error.errors
            );
            throw new Error("Invalid data");
        }
        console.log(validation.data);
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
