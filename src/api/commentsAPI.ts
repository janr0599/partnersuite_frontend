import api from "@/lib/axios";
import { CommentAPIType } from "@/types/commentsTypes";
import { isAxiosError } from "axios";

export const createComment = async ({
    ticketId,
    formData,
}: Pick<CommentAPIType, "ticketId" | "formData">) => {
    try {
        const { data } = await api.post<{ message: string }>(
            `/tickets/${ticketId}/comments`,
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
