import { z } from "zod";
import { commentSchema } from "./commentsSchema";
import { authenticatedUserSchema } from "./authSchemas";

export const ticketStatusSchema = z.enum(["open", "in_progress", "closed"]);

export const ticketSchema = z.object({
    _id: z.string(),
    createdBy: authenticatedUserSchema,
    title: z.string().trim().min(1, "title is required"),
    description: z.string().trim().min(1, "description is required"),
    category: z.string().min(1, "category is required"),
    comments: z.array(commentSchema),
    status: ticketStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
    closedAt: z.string().nullable(),
});

export const ticketsSchema = z.array(
    ticketSchema.pick({
        _id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        closedAt: true,
    })
);

export const DashboardTicketsSchema = z.array(
    ticketSchema.pick({
        _id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        closedAt: true,
    })
);

export const ticketFormSchema = ticketSchema.pick({
    title: true,
    description: true,
    category: true,
});

export const tableTicketSchema = ticketSchema.pick({
    _id: true,
    title: true,
    description: true,
    category: true,
    status: true,
    createdBy: true,
    createdAt: true,
});
