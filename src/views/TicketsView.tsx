import TicketsTable from "@/components/tickets/TicketsTable";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/api/ticketsAPI";
import { useAuth } from "@/hooks/useauth";
import { isManager } from "@/utils/policies";
import { statusTranslations } from "@/locales/en";
import CreateTicketModal from "@/components/tickets/CreateTicketModal";
import EditTicketData from "@/components/tickets/EditTicketData";
import TicketDetailsModal from "@/components/tickets/TicketDetailsModal";
import { useState } from "react";

function TicketsView() {
    const { data: user, isLoading: userLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [filtering, setFiltering] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["tickets"],
        queryFn: () => getTickets(),
        retry: false,
    });

    if (isLoading || userLoading) return "Loading...";

    if (data && user)
        return (
            <div className="bg-white p-6 md:px-10 shadow-xl rounded-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">
                        {isManager(user!)
                            ? "Ticket Management"
                            : "Your Tickets"}
                    </h1>
                    {!isManager(user!) && (
                        <button
                            className="bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-80 inline-flex items-center gap-2"
                            onClick={() =>
                                navigate(location.pathname + "?newTicket=true")
                            }
                        >
                            <FiPlus className="text-xl" />
                            Create Ticket
                        </button>
                    )}
                </div>
                {data && data.length > 0 ? (
                    <TicketsTable
                        tickets={data}
                        isLoading={isLoading}
                        user={user!}
                        filtering={filtering}
                        setFiltering={setFiltering}
                    />
                ) : (
                    <div className="text-lg mt-10 text-slate-500">
                        Tickets will show up here
                    </div>
                )}
                <CreateTicketModal />
                <TicketDetailsModal tickets={data} />
                <EditTicketData />
            </div>
        );
}

export default TicketsView;
