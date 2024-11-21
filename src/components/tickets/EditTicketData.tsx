import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Ticket } from "@/types/ticketsTypes";
import EditTicketModal from "./EditTicketModal";
import { getTicketById } from "@/api/ticketsAPI";

function EditTicketData() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ticketId = queryParams.get("editTicket")!;

    const { data, isError } = useQuery<Ticket>({
        queryKey: ["ticket", ticketId],
        queryFn: () => getTicketById(ticketId),
        enabled: !!ticketId, // evaluates a value as true or false whether they have a value or not, in this case if affiliateId has a value it's because it's present in the url and we want the query to run
        retry: false,
    });

    if (isError) return <Navigate to={"/404"} />;

    if (data) return <EditTicketModal ticket={data} />;
}

export default EditTicketData;
