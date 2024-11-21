import CreateTicketModal from "@/components/tickets/CreateTicketModal";
import TicketDetailsModal from "@/components/tickets/TicketDetailsModal";
import TicketsTable from "@/components/tickets/TicketsTable";
import { FiDollarSign, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/api/ticketsAPI";
import { Tickets } from "@/types/ticketsTypes";
import { useAuth } from "@/hooks/useauth";
import { isManager } from "@/utils/policies";
import { statusTranslations } from "@/locales/en";
import EditTicketData from "@/components/tickets/EditTicketData";

function TicketsView() {
    const { data: user, isLoading: userLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery<Tickets>({
        queryKey: ["tickets"],
        queryFn: () => getTickets(),
        retry: false,
    });

    if (isLoading && userLoading) return "Loading...";

    if (data && user)
        return (
            <div className="shadow-xl rounded-lg bg-white p-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">
                        {isManager(user) ? "Ticket Management" : "Your Tickets"}
                    </h1>
                    {isManager(user) ? (
                        <div className="flex gap-6 font-semibold">
                            <div className="inline-flex gap-2 items-center">
                                <FiSearch className="text-gray-500" />

                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    className="bg-ehite p-2 rounded-md border border-slate-300 outline-none text-gray-500 text-sm"
                                />
                            </div>

                            <select
                                className="w-1/2 p-2 bg-white border border-slate-300 rounded-lg text-sm text-gray-500 outline-none"
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
                        <div className="flex gap-6 font-bold">
                            <button
                                className="bg-black hover:opacity-80 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 transition-opacity"
                                onClick={() =>
                                    navigate(
                                        location.pathname + "?newTicket=true"
                                    )
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
                    )}
                </div>
                {data.length === 0 ? (
                    <div className="text-lg mt-10 text-slate-500">
                        Tickets will show up here
                    </div>
                ) : (
                    <TicketsTable tickets={data} isLoading={isLoading} />
                )}
                <CreateTicketModal />
                <TicketDetailsModal tickets={data} />
                <EditTicketData />
            </div>
        );
}

export default TicketsView;
