import { z } from "zod";

export const ticketStatusSchema = z.enum(["open", "in_progress", "closed"]);

export const ticketSchema = z.object({
    _id: z.string(),
    // name: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    status: ticketStatusSchema,
    createdAt: z.string(),
});
export const ticketsSchema = z.array(ticketSchema);

export const ticketFormSchema = ticketSchema.pick({
    title: true,
    description: true,
    category: true,
});
