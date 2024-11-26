import AffiliatesByCountryCard from "@/components/dashboard/AffiliatesByCountry";
import AreaChartCard from "@/components/dashboard/AreaChart";
import { TicketsStatCard } from "@/components/dashboard/TicketsStatCard";

function DashboardView() {
    return (
        <div className="container mx-auto p-4">
            {/* <!-- First Row: Three Cards --> */}
            <TicketsStatCard />

            {/* <!-- Second Row: One Large Card and One Small Card --> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-6">
                <AreaChartCard />

                <AffiliatesByCountryCard />
            </div>

            {/* <!-- Third Row: Full Width Table --> */}
            <div className="grid grid-cols-1">
                <div className="col-span-1 bg-white p-4 rounded shadow">
                    <h3 className="text-tremor-default font-medium text-tremor-content-strong">
                        Latest Tickets
                    </h3>
                    {/* <!-- Table Content --> */}
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Header 1</th>
                                <th className="px-4 py-2 border-b">Header 2</th>
                                <th className="px-4 py-2 border-b">Header 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 border-b">Data 1</td>
                                <td className="px-4 py-2 border-b">Data 2</td>
                                <td className="px-4 py-2 border-b">Data 3</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b">Data 4</td>
                                <td className="px-4 py-2 border-b">Data 5</td>
                                <td className="px-4 py-2 border-b">Data 6</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DashboardView;
