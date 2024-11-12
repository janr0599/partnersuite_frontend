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

export const updateComment = async ({
    ticketId,
    commentId,
    formData,
}: Pick<CommentAPIType, "ticketId" | "commentId" | "formData">) => {
    try {
        const { data } = await api.put<{ message: string }>(
            `/tickets/${ticketId}/comments/${commentId}`,
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

export const deleteComment = async ({
    ticketId,
    commentId,
}: Pick<CommentAPIType, "ticketId" | "commentId">) => {
    try {
        const { data } = await api.delete<{ message: string }>(
            `/tickets/${ticketId}/comments/${commentId}`
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};
