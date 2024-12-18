import api from "@/lib/axios";
import {
    DashboardTicketsSchema,
    ticketSchema,
    ticketsSchema,
} from "@/schemas/ticketsShemas";
import {
    DashboardTickets,
    Ticket,
    TicketAPIType,
    TicketFormData,
    Tickets,
} from "@/types/ticketsTypes";
import { isAxiosError } from "axios";

export const getTickets = async (): Promise<Tickets> => {
    try {
        const { data } = await api.get<{ tickets: Tickets }>("/tickets");
        console.log(data.tickets);
        const validation = ticketsSchema.safeParse(data.tickets);
        if (!validation.success) {
            console.error(
                "getTickets data validation failed:",
                validation.error.errors
            );
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

export const getPreviousDayTickets = async (): Promise<DashboardTickets> => {
    try {
        const { data } = await api.get<{ tickets: DashboardTickets }>(
            "/tickets/previousDayTickets"
        );
        const validation = DashboardTicketsSchema.safeParse(data.tickets);
        if (!validation.success) {
            console.error(
                "getPreviousDayTickets data validation failed:",
                validation.error.errors
            );
            throw new Error("Invalid data");
        }
        return validation.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const getLatestTickets = async () => {
    try {
        const { data } = await api.get<{ tickets: Tickets }>(
            "/tickets/latestTickets"
        );
        const validation = ticketsSchema.safeParse(data.tickets);
        if (!validation.success) {
            console.error(
                "getallTickets data validation failed:",
                validation.error.errors
            );
            throw new Error("Invalid data");
        }
        return validation.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const getTicketsByStatus = async (status: Ticket["status"]) => {
    try {
        const { data } = await api.get<{ tickets: Tickets }>(
            `/tickets/${status}`
        );
        const validation = ticketsSchema.safeParse(data.tickets);
        if (!validation.success) {
            console.error(
                "getTicketsByStatus data validation failed:",
                validation.error.errors
            );
            throw new Error("Invalid data");
        }
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
            console.error(
                "get ticket byId data validation failed:",
                validation.error.errors
            );
            throw new Error("Invalid data");
        }
        return validation.data;
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

export const updateTicket = async ({
    ticketId,
    formData,
}: Pick<TicketAPIType, "ticketId" | "formData">) => {
    try {
        const { data } = await api.put<{ message: string }>(
            `/tickets/${ticketId}`,
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

export const deleteTicket = async ({
    ticketId,
}: Pick<TicketAPIType, "ticketId">) => {
    try {
        const { data } = await api.delete<{ message: string }>(
            `/tickets/${ticketId}`
        );
        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};

export const uploadFile = async (file: File) => {
    let formData = new FormData();
    formData.append("file", file);
    try {
        const { data } = await api.post<{ image: string }>(
            "/tickets/upload-file",
            formData
        );
        return data.image;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("An unexpected error occurred");
    }
};
