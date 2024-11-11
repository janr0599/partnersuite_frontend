import api from "@/lib/axios";
import { ticketSchema, ticketsSchema } from "@/schemas/ticketsShemas";
import { Ticket, TicketFormData, Tickets } from "@/types/ticketsTypes";
import { isAxiosError } from "axios";

export const getTickets = async (): Promise<Tickets> => {
    try {
        const { data } = await api.get<{ tickets: Tickets }>("/tickets");
        console.log(data.tickets);
        const validation = ticketsSchema.safeParse(data.tickets);
        if (!validation.success) {
            throw new Error("Invalid data");
        }
        console.log(validation.data);
        return validation.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const createTicket = async (formData: TicketFormData) => {
    try {
        const { data } = await api.post<{ message: string }>(
            "/tickets",
            formData
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const getTicketById = async (id: Ticket["_id"]) => {
    try {
        const { data } = await api.get<{ ticket: Ticket }>(`/tickets/${id}`);
        const validation = ticketSchema.safeParse(data.ticket);
        if (!validation.success) {
            throw new Error("Invalid data");
        }
        return data.ticket;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const updateTicketStatus = async ({
    ticketId,
    status,
}: {
    ticketId: Ticket["_id"];
    status: Ticket["status"];
}) => {
    try {
        const { data } = await api.patch<{ message: string }>(
            `/tickets/${ticketId}`,
            { status }
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};
