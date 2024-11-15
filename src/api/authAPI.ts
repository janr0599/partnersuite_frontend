import api from "@/lib/axios";
import { authenticatedUserSchema } from "@/schemas/authSchemas";
import {
    AuthenticatedUser,
    UserLoginForm,
    UserRegistrationForm,
} from "@/types/authTypes";
import { isAxiosError } from "axios";

export const getUser = async (): Promise<AuthenticatedUser> => {
    try {
        // Fetch user data from the API
        const { data } = await api<{ user: AuthenticatedUser }>("/auth/user");

        // Validate the received data
        const validation = authenticatedUserSchema.safeParse(data.user);
        if (validation.success) {
            return validation.data;
        }

        // Throw error if validation fails
        throw new Error("Validation failed");
    } catch (error) {
        // Handle Axios-specific errors
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }

        // Handle any other unexpected errors
        throw new Error("An unexpected error occurred");
    }
};

export const createAccount = async (formData: UserRegistrationForm) => {
    try {
        const { data } = await api.post<{ message: string }>(
            "/auth/create-account",
            formData
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
};

export const authenticateUser = async (formData: UserLoginForm) => {
    try {
        const { data } = await api.post<{ token: string }>(
            "/auth/login",
            formData
        );

        localStorage.setItem("AUTH_TOKEN_PARTNERSUITE", data.token);

        return data.token;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
};
