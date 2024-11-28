import { getLatestTickets, getPreviousDayTickets } from "@/api/ticketsAPI";
import AffiliatesByCountryCard from "@/components/dashboard/AffiliatesByCountry";
import AreaChartCard from "@/components/dashboard/AreaChart";
import LatestTicketsTable from "@/components/dashboard/LatestTicketsTable";
import { TicketsStatCard } from "@/components/dashboard/TicketsStatCard";
import { useQuery } from "@tanstack/react-query";

function DashboardView() {
    const {
        data: tickets,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["latestTickets"],
        queryFn: getLatestTickets,
    });

    const {
        data: previousDayTickets,
        isLoading: isLoadingPrevious,
        error: errorPrevious,
    } = useQuery({
        queryKey: ["previousDayTickets"],
        queryFn: getPreviousDayTickets,
    });

    if (isLoading || isLoadingPrevious) return <div>Loading...</div>;
    if (error || errorPrevious) return <div>Error loading tickets...</div>;

    if (tickets && previousDayTickets)
        return (
            <div className="">
                {/* <!-- First Row: Three Cards --> */}
                <TicketsStatCard
                    currentTickets={tickets}
                    previousDayTickets={previousDayTickets}
                />

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
