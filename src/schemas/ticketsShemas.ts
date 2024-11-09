import { z } from "zod";

export const ticketsSchema = z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    category: z.string(),
    status: z.string(),
    date: z.string(),
});
