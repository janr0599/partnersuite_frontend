import { z } from "zod";

export const ticketStatusSchema = z.enum(["open", "in_progress", "closed"]);

export const ticketSchema = z.object({
    _id: z.string(),
    // name: z.string(),
    title: z.string().trim().min(1, "title is required"),
    description: z.string().trim().min(1, "description is required"),
    category: z.string().min(1, "category is required"),
    status: ticketStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const ticketsSchema = z.array(ticketSchema);

export const ticketFormSchema = ticketSchema.pick({
    title: true,
    description: true,
    category: true,
});
