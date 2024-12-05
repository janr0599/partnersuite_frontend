import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TableTicket, Tickets } from "@/types/ticketsTypes";
import { categoryTranslations, statusTranslations } from "@/locales/en";
import { formatDate } from "@/utils/utils";
import { FiAlertCircle } from "react-icons/fi";

type LatestTicketsTableProps = {
    latestTickets: Tickets;
    isLoading: boolean;
};

const LatestTicketsTable = ({
    latestTickets,
    isLoading,
}: LatestTicketsTableProps) => {
    if (isLoading) return <div>Loading...</div>;

    const columns: ColumnDef<TableTicket>[] = [
        {
            header: "ID",
            accessorKey: "ticketId",
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
    ];

    const table = useReactTable({
        data: latestTickets || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }
    return (
        <div className="col-span-1 bg-white p-4 rounded shadow overflow-x-auto">
            <div className="p-4">
                <h3 className="text-tremor-default font-medium text-tremor-content-strong">
                    Latest Tickets
                </h3>
            </div>

            <table className="min-w-full">
                <thead className="text-slate-500">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 border-b border-slate-300 text-left text-sm md:text-md font-medium"
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
                        <tr key={row.id} className="hover:bg-slate-100">
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-3 border-b border-slate-300 text-sm md:text-md font-semibold truncate"
                                >
                                    <div className="inline-flex items-center gap-2">
                                        {cell.getValue<string>() === "open" && (
                                            <FiAlertCircle className="text-sm text-yellow-600" />
                                        )}
                                        <div className="truncate max-w-[200px]">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LatestTicketsTable;
