import { Card } from "@tremor/react";
import { isToday, isYesterday } from "date-fns";
import { DashboardTickets, Tickets } from "@/types/ticketsTypes";

// Function to calculate changes dynamically
const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0; // Handle division by zero
    return (((current - previous) / previous) * 100).toFixed(1);
};

// Example data transformation function
const calculateTicketStats = (
    tickets: Tickets,
    previousDayTickets: DashboardTickets
) => {
    const openedToday = tickets.filter((ticket) =>
        isToday(new Date(ticket.createdAt))
    ).length;

    const previousOpenedToday = previousDayTickets.filter((ticket) =>
        isYesterday(new Date(ticket.createdAt))
    ).length;

    const inProgressTickets = tickets.filter(
        (ticket) => ticket.status === "in_progress"
    ).length;

    const closedToday = tickets.filter(
        (ticket) =>
            ticket.status === "closed" &&
            ticket.closedAt &&
            isToday(new Date(ticket.closedAt))
    ).length;

    const previousClosedToday = previousDayTickets.filter(
        (ticket) =>
            ticket.status === "closed" &&
            ticket.closedAt &&
            isYesterday(new Date(ticket.closedAt))
    ).length;

    return [
        {
            name: "Opened Tickets Today",
            stat: `${openedToday}`,
            change: `${calculateChange(openedToday, previousOpenedToday)}%`,
            changeType:
                openedToday >= previousOpenedToday ? "positive" : "negative",
        },
        {
            name: "In Progress Tickets",
            stat: `${inProgressTickets}`,
        },
        {
            name: "Closed Tickets Today",
            stat: `${closedToday}`,
            change: `${calculateChange(closedToday, previousClosedToday)}%`,
            changeType:
                closedToday >= previousClosedToday ? "positive" : "negative",
        },
    ];
};

type TicketsStatCardProps = {
    currentTickets: Tickets;
    previousDayTickets: DashboardTickets;
};

export const TicketsStatCard = ({
    currentTickets,
    previousDayTickets,
}: TicketsStatCardProps) => {
    const ticketStats = calculateTicketStats(
        currentTickets!,
        previousDayTickets!
    );

    return (
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {ticketStats.map((item) => (
                <Card key={item.name}>
                    <dt className="text-tremor-default font-medium text-tremor-content-strong">
                        {item.name}
                    </dt>
                    <dd className="mt-2 flex items-baseline space-x-2.5">
                        <span className="text-tremor-metric font-semibold text-tremor-content-strong">
                            {item.stat}
                        </span>
                        <span
                            className={`text-tremor-default font-medium ${
                                item.changeType === "positive"
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {item.change}{" "}
                            {item.name !== "In Progress Tickets" && (
                                <span className="text-xs text-slate-300">
                                    - 24hr change
                                </span>
                            )}
                        </span>
                    </dd>
                </Card>
            ))}
        </dl>
    );
};
