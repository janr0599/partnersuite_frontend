import {
    tableTicketSchema,
    ticketFormSchema,
    ticketSchema,
    ticketsSchema,
} from "@/schemas/ticketsShemas";
import { z } from "zod";

export type Ticket = z.infer<typeof ticketSchema>;
export type Tickets = z.infer<typeof ticketsSchema>;
export type TicketFormData = z.infer<typeof ticketFormSchema>;
export type TableTicket = z.infer<typeof tableTicketSchema>;
