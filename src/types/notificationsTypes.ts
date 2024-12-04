import {
    notificationSchema,
    notificationsSchema,
} from "@/schemas/notificationsSchema";
import z from "zod";

export type Notification = z.infer<typeof notificationSchema>;
export type Notifications = z.infer<typeof notificationsSchema>;
