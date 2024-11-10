import {
    ticketFormSchema,
    ticketSchema,
    ticketsSchema,
} from "@/schemas/ticketsShemas";
import { z } from "zod";

export type Ticket = z.infer<typeof ticketSchema>;
export type Tickets = z.infer<typeof ticketsSchema>;
export type TicketFormData = z.infer<typeof ticketFormSchema>;
