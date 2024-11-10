import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
// import { data } from "../../data";
import { Ticket, Tickets } from "@/types/ticketsTypes";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/api/ticketsAPI";

function TicketsTable() {
    const { data, isLoading } = useQuery<Tickets>({
        queryKey: ["tickets"],
        queryFn: () => getTickets(),
        retry: false,
    });

    const columns: ColumnDef<Ticket>[] = [
        {
            header: "Ticket ID",
            accessorKey: "_id",
        },
        // {
        //     header: "Name",
        //     accessorKey: "name",
        // },
        {
            header: "Title",
            accessorKey: "title",
        },
        {
            header: "Status",
            accessorKey: "status",
        },
        {
            header: "Category",
            accessorKey: "category",
        },
        {
            header: "Created",
            accessorKey: "createdAt",
        },
        // {
        //     header: "Actions",
        //     id: "actions",
        //     cell: ({ row }) => (
        //         <button className="text-red-500 hover:text-red-700">
        //             View Details
        //         </button>
        //     ),
        // },
    ];

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }
    return (
        <div className="mt-10 overflow-x-auto">
            <table className="min-w-full bg-white ">
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
                        <tr key={row.id} className="">
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-2 border-b border-slate-300 text-sm font-medium"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
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
