import { AreaChart, Card } from "@tremor/react";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/api/ticketsAPI";
import { format, parseISO, parse } from "date-fns";
import { Tickets } from "@/types/ticketsTypes";

const valueFormatter = (number: number) =>
    `${Intl.NumberFormat("us").format(number).toString()}`;

const processTicketData = (tickets: Tickets) => {
    const groupedData = tickets.reduce<Record<string, number>>(
        (acc, ticket) => {
            const date = format(parseISO(ticket.createdAt), "MMM yy");
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += 1;
            return acc;
        },
        {}
    );

    const sortedData = Object.keys(groupedData)
        .map((date) => ({
            date,
            tickets: groupedData[date],
        }))
        .sort(
            (a, b) =>
                parse(`01 ${a.date}`, "dd MMM yy", new Date()).getTime() -
                parse(`01 ${b.date}`, "dd MMM yy", new Date()).getTime()
        );

    return sortedData;
};

export default function AreaChartCard() {
    const {
        data: tickets,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tickets"],
        queryFn: getTickets,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading tickets</div>;

    const data = processTicketData(tickets!);

    return (
        <>
            <Card className="sm:mx-auto sm:max-w-lg min-w-full col-span-1 md:col-span-2 lg:col-span-8 bg-white p-4 rounded shadow">
                <h3 className="font-medium text-tremor-content-strong">
                    Ticket Metrics
                </h3>
                <AreaChart
                    data={data}
                    index="date"
                    categories={["tickets"]}
                    colors={["indigo-500"]}
                    valueFormatter={valueFormatter}
                    showLegend={false}
                    showYAxis={true}
                    showGradient={true}
                    startEndOnly={false}
                    className="mt-6 h-96"
                />
            </Card>
        </>
    );
}
