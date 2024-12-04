import api from "@/lib/axios";
import { notificationsSchema } from "@/schemas/notificationsSchema";
import { Notifications, Notification } from "@/types/notificationsTypes";
import { isAxiosError } from "axios";

export const getNotifications = async () => {
    try {
        const { data } = await api.get<{ notifications: Notifications }>(
            "/notifications"
        );
        console.log(data.notifications);
        const validation = notificationsSchema.safeParse(data.notifications);
        if (!validation.success) {
            console.error(
                "getNotifications data validation failed:",
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

export const markNotificationAsRead = async (id: Notification["_id"]) => {
    try {
        await api.post(`/notifications/${id}`);
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const markAllNotificationsAsRead = async () => {
    try {
        await api.post("/notifications");
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};
