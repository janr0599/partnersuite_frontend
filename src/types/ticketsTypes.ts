import {
    DashboardTicketsSchema,
    tableTicketSchema,
    ticketFormSchema,
    ticketSchema,
    ticketsSchema,
} from "@/schemas/ticketsShemas";
import { z } from "zod";

export type Ticket = z.infer<typeof ticketSchema>;
export type Tickets = z.infer<typeof ticketsSchema>;
export type DashboardTickets = z.infer<typeof DashboardTicketsSchema>;
export type TicketFormData = z.infer<typeof ticketFormSchema>;
export type TableTicket = z.infer<typeof tableTicketSchema>;
export type TicketAPIType = {
    ticketId: Ticket["_id"];
    formData: TicketFormData;
};
