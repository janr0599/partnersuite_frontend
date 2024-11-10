import api from "@/lib/axios";
import { ticketsSchema } from "@/schemas/ticketsShemas";
import { TicketFormData, Tickets } from "@/types/ticketsTypes";
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
        console.log(data);
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};
