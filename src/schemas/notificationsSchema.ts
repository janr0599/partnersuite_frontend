import z from "zod";

export const notificationSchema = z.object({
    message: z.string(),
    recipient: z.string(),
    recipientModel: z.string(),
    status: z.string(),
    link: z.string(),
    createdAt: z.string(),
    _id: z.string(),
});

export const notificationsSchema = z.array(notificationSchema);
