import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { data } from "../../data";
import { Ticket } from "@/types/ticketsTypes";

function TicketsTable() {
    // const { data } = useQuery<Project>({
    //     queryKey: ["tickets"],
    //     queryFn: () => getTickets(),
    //     retry: false,
    // });

    const columns: ColumnDef<Ticket>[] = [
        {
            header: "Ticket ID",
            accessorKey: "id",
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
            accessorKey: "date",
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
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <div className="mt-10 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 border-b border-gray-200 text-left text-lg font-medium text-white"
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
                        <tr key={row.id} className="even:bg-gray-100">
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-2 border-b border-gray-200 text-base font-bold"
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
