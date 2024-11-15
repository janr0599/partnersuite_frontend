import CreateTicketModal from "@/components/tickets/CreateTicketModal";
import TicketDetailsModal from "@/components/tickets/TicketDetailsModal";
import TicketsTable from "@/components/tickets/TicketsTable";
import { FiDollarSign, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/api/ticketsAPI";
import { Tickets } from "@/types/ticketsTypes";

function DashboardView() {
    const location = useLocation();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery<Tickets>({
        queryKey: ["tickets"],
        queryFn: () => getTickets(),
        retry: false,
    });

    if (data)
        return (
            <div className="shadow-xl rounded-lg bg-white p-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Your Tickets</h1>
                    <div className="flex gap-6 font-bold">
                        <button
                            className="bg-black hover:opacity-80 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 transition-opacity"
                            onClick={() =>
                                navigate(location.pathname + "?newTicket=true")
                            }
                        >
                            <FiPlus className="text-xl" />
                            Create Ticket
                        </button>
                        <button className="bg-white hover:bg-slate-100 text-black px-4 py-2 border border-slate-500 rounded-md inline-flex items-center gap-2 transition-colors">
                            <FiDollarSign className="text-xl" />
                            Request Bonus Top-up
                        </button>
                    </div>
                </div>
                <TicketsTable tickets={data} isLoading={isLoading} />
                <CreateTicketModal />
                <TicketDetailsModal tickets={data} />
            </div>
        );
}

export default DashboardView;
