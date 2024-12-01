import {
    getLatestTickets,
    getPreviousDayTickets,
    getTickets,
} from "@/api/ticketsAPI";
import AffiliatesByCountryCard from "@/components/dashboard/AffiliatesByCountry";
import AreaChartCard from "@/components/dashboard/AreaChart";
import LatestTicketsTable from "@/components/dashboard/LatestTicketsTable";
import { TicketsStatCard } from "@/components/dashboard/TicketsStatCard";
import { useQuery } from "@tanstack/react-query";

function DashboardView() {
    const {
        data: latestTickets,
        isLoading,
        error: errorLatest,
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

    const {
        data: tickets,
        isLoading: isLoadingTickets,
        error: errorTickets,
    } = useQuery({
        queryKey: ["tickets"],
        queryFn: getTickets,
        retry: false,
    });

    if (isLoading || isLoadingPrevious || isLoadingTickets)
        return <div>Loading...</div>;
    if (errorLatest || errorPrevious || errorTickets)
        return <div>Error loading tickets...</div>;

    if (latestTickets && previousDayTickets && tickets)
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
                    <LatestTicketsTable
                        latestTickets={latestTickets}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        );
}

export default DashboardView;
