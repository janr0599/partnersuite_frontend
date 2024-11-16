import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TableTicket, Tickets } from "@/types/ticketsTypes";

import { formatDate } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import { categoryTranslations, statusTranslations } from "@/locales/en";
import { FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";

type TicketsTableProps = {
    tickets: Tickets;
    isLoading: boolean;
};

function TicketsTable({ tickets, isLoading }: TicketsTableProps) {
    const navigate = useNavigate();
    console.log(tickets);

    const columns: ColumnDef<TableTicket>[] = [
        {
            header: "Ticket ID",
            accessorKey: "_id",
            cell: (info) => {
                // Generate the custom ID format
                const rowIndex = info.row.index + 1; // Starting index from 1 instead of 0
                const formattedId = `T-${rowIndex.toString().padStart(4, "0")}`;
                return formattedId;
            },
        },
        {
            header: "Affiliate",
            accessorKey: "createdBy.name",
        },
        {
            header: "Title",
            accessorKey: "title",
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (info) => {
                return statusTranslations[info.getValue<string>()];
            },
        },
        {
            header: "Category",
            accessorKey: "category",
            cell: (info) => {
                return categoryTranslations[info.getValue<string>()];
            },
        },
        {
            header: "Created",
            accessorKey: "createdAt",
            cell: (info) => {
                const isoString = info.getValue<string>();
                return formatDate(isoString);
            },
        },
        {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => (
                <button
                    className="border border-slate-300 hover:bg-slate-200 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    onClick={() =>
                        navigate(
                            location.pathname +
                                `?viewTicket=${row.original._id}`
                        )
                    }
                >
                    View Details
                </button>
            ),
        },
    ];

    const table = useReactTable({
        data: tickets || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }
    return (
        <div className="mt-8 overflow-x-auto">
            <table className="min-w-full">
                <thead className="text-slate-500">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 border-b border-slate-300 text-left text-md font-medium"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="hover:bg-slate-100 transition-colors"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-2 border-b border-slate-300 text-sm font-medium
                                    "
                                >
                                    <div className="inline-flex items-center gap-2">
                                        {cell.getValue<string>() === "open" && (
                                            <FiAlertCircle className="text-sm text-yellow-600" />
                                        )}
                                        {cell.getValue<string>() ===
                                            "in_progress" && (
                                            <FiClock className="text-sm text-blue-600" />
                                        )}
                                        {cell.getValue<string>() ===
                                            "closed" && (
                                            <FiCheckCircle className="text-sm text-green-600" />
                                        )}
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TicketsTable;
