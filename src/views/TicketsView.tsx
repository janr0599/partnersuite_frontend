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

function TicketsView() {
    const { data: user, isLoading: userLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["tickets"],
        queryFn: () => getTickets(),
        retry: false,
    });

    if (isLoading || userLoading) return "Loading...";

    if (data && user)
        return (
            <div className="bg-white p-6 md:p-10 shadow-xl rounded-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">
                        {isManager(user!)
                            ? "Ticket Management"
                            : "Your Tickets"}
                    </h1>
                    {isManager(user!) ? (
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex items-center">
                                <FiSearch className="absolute left-3 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    className="w-full md:w-auto bg-white border border-slate-300 rounded-md pl-10 py-2 text-sm text-gray-500 outline-none"
                                />
                            </div>
                            <select
                                className="bg-white border border-slate-300 rounded-md py-2 px-4 text-sm text-gray-500 outline-none"
                                onChange={() => {}}
                            >
                                <option value="all">All Statuses</option>
                                {Object.entries(statusTranslations).map(
                                    ([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    ) : (
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
