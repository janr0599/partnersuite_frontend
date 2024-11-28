import api from "@/lib/axios";
import { ChangePasswordForm, UserProfileForm } from "@/types/profileTypes";
import { isAxiosError } from "axios";

export const updateProfile = async (formData: UserProfileForm) => {
    try {
        const { data } = await api.put<{ message: string }>(
            "/profile",
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

export const changePassword = async (formData: ChangePasswordForm) => {
    try {
        const { data } = await api.post<{ message: string }>(
            "/profile/change-password",
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
