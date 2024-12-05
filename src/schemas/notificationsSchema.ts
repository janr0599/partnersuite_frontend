import z from "zod";

export const notificationTypesSchema = z.enum([
    "ticketComment",
    "topUpRequest",
]);

export const notificationSchema = z.object({
    message: z.string(),
    recipient: z.string(),
    recipientModel: z.string(),
    status: z.string(),
    type: notificationTypesSchema,
    link: z.string(),
    createdAt: z.string(),
    _id: z.string(),
});

export const notificationsSchema = z.array(notificationSchema);
