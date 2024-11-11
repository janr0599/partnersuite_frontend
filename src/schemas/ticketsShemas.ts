import { z } from "zod";
import { commentSchema } from "./commentsSchema";

export const ticketStatusSchema = z.enum(["open", "in_progress", "closed"]);

export const ticketSchema = z.object({
    _id: z.string(),
    // name: z.string(),
    title: z.string().trim().min(1, "title is required"),
    description: z.string().trim().min(1, "description is required"),
    category: z.string().min(1, "category is required"),
    comments: z.array(commentSchema),
    status: ticketStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const ticketsSchema = z.array(
    ticketSchema.pick({
        _id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        createdAt: true,
    })
);

export const ticketFormSchema = ticketSchema.pick({
    title: true,
    description: true,
    category: true,
});
