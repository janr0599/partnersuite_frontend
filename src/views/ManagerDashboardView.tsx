import { getLatestTickets } from "@/api/ticketsAPI";
import AffiliatesByCountryCard from "@/components/dashboard/AffiliatesByCountry";
import AreaChartCard from "@/components/dashboard/AreaChart";
import LatestTicketsTable from "@/components/dashboard/LatestTicketsTable";
import { TicketsStatCard } from "@/components/dashboard/TicketsStatCard";
import TickeDetailsModal from "@/components/tickets/TicketDetailsModal";
import { useQuery } from "@tanstack/react-query";

function DashboardView() {
    const { data: tickets, isLoading } = useQuery({
        queryKey: ["latestTickets"],
        queryFn: getLatestTickets,
    });

    if (isLoading) return <div>Loading...</div>;
    if (tickets)
        return (
            <div className="">
                {/* <!-- First Row: Three Cards --> */}
                <TicketsStatCard />

                {/* <!-- Second Row: One Large Card and One Small Card --> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-6">
                    <AreaChartCard />

                    <AffiliatesByCountryCard />
                </div>

                {/* <!-- Third Row: Full Width Table --> */}
                <div className="grid grid-cols-1">
                    <LatestTicketsTable data={tickets} isLoading={isLoading} />
                </div>
            </div>
        );
}

export default DashboardView;
