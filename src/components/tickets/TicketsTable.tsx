import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { FilterFn } from "@tanstack/react-table";
import { TableTicket, Ticket, Tickets } from "@/types/ticketsTypes";

import { formatDate } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import { categoryTranslations, statusTranslations } from "@/locales/en";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsLeft,
    FiChevronsRight,
    FiChevronUp,
    FiClock,
    FiEdit,
    FiPlus,
    FiSearch,
    FiTrash2,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteTicket } from "@/api/ticketsAPI";
import { AuthenticatedUser } from "@/types/authTypes";
import { useMemo, useState } from "react";

type TicketsTableProps = {
    tickets: Tickets;
    isLoading: boolean;
    user: AuthenticatedUser;
    filtering: string;
    setFiltering: React.Dispatch<React.SetStateAction<string>>;
};

function TicketsTable({
    tickets,
    isLoading,
    user,
    filtering,
    setFiltering,
}: TicketsTableProps) {
    const navigate = useNavigate();

    const canDelete = useMemo(
        () => user._id === tickets[0].createdBy._id,
        [user]
    );

    const queryclient = useQueryClient();
    const { mutate: mutateDeleteTicket } = useMutation({
        mutationFn: deleteTicket,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryclient.invalidateQueries({
                queryKey: ["tickets"],
            });
        },
    });

    const handleDeleteTicket = (ticketId: Ticket["_id"]) => {
        Swal.fire({
            title: "Delete ticket?",
            text: "This cannot be undone",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Delete",
            reverseButtons: true,
            customClass: {
                cancelButton:
                    "text-black bg-slate-200 hover:bg-slate-300 transition-colors",
                confirmButton: "hover:bg-red-600 transition-colors",
                popup: "w-[300px] md:w-[400px] text-sm md:text-base rounded-md",
                title: "text-black font-bold text-left text-md w-full p-3 rounded-md",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                mutateDeleteTicket({
                    ticketId,
                });
            }
        });
    };

    const statusFilter: FilterFn<TableTicket> = (
        row,
        columnId,
        filterValue
    ) => {
        if (!filterValue) return true; // Show all rows if no filter is applied
        return row.getValue<string>(columnId) === filterValue; // Match row's status
    };

    // Custom filter functions
    const filterFns = {
        statusFilter,
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        table.getColumn("status")?.setFilterValue(e.target.value);
    };

    const columns: ColumnDef<TableTicket>[] = [
        {
            header: "ID",
            accessorKey: "_id",
            cell: (info) => {
                const rowIndex = info.row.index + 1;
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
            cell: (info) => statusTranslations[info.getValue<string>()],
            filterFn: statusFilter, // Use the custom filter
        },
        {
            header: "Category",
            accessorKey: "category",
            cell: (info) => categoryTranslations[info.getValue<string>()],
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
                <>
                    <button
                        className="border border-slate-300 hover:bg-slate-200 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        onClick={() =>
                            navigate(
                                location.pathname +
                                    `?viewTicket=${row.original._id}`
                            )
                        }
                    >
                        Details
                    </button>

                    {canDelete && (
                        <>
                            <button
                                className="border border-slate-300 hover:bg-slate-200 rounded-md p-2 text-sm font-medium transition-colors group"
                                onClick={() =>
                                    navigate(
                                        location.pathname +
                                            `?editTicket=${row.original._id}`
                                    )
                                }
                            >
                                <FiEdit className="size-5 group-hover:text-indigo-500 cursor-pointer transition-colors" />
                            </button>
                            <button
                                className="border border-slate-300 hover:bg-slate-200 rounded-md p-2 text-sm font-medium transition-colors group"
                                onClick={() =>
                                    handleDeleteTicket(row.original._id)
                                }
                            >
                                <FiTrash2 className="size-5 group-hover:text-red-500 hover:cursor-pointer transition-colors" />
                            </button>
                        </>
                    )}
                </>
            ),
        },
    ];

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data: tickets || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 8,
            },
        },
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter: filtering,
        },
        onGlobalFilterChange: setFiltering,
        onSortingChange: setSorting,
        filterFns, // Attach custom filter functions
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="overflow-x-auto mt-4 lg:mt-0">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-6 font-normal items-start flex-1 w-full lg:max-w-md lg:ml-auto">
                <div className="relative flex items-center flex-1 min-w-[250px] md:w-auto">
                    <FiSearch className="absolute left-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search Tickets..."
                        className="w-full bg-white border border-slate-300 rounded-md pl-10 py-2 text-sm text-gray-500 outline-none"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                    />
                </div>
                <div className="md:w-1/2 min-w-36 ">
                    <select
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm text-gray-500 outline-none"
                        onChange={handleStatusChange}
                        value={
                            (table
                                .getColumn("status")
                                ?.getFilterValue() as string) || ""
                        } // Cast value
                    >
                        <option value="">All</option>
                        {Object.entries(statusTranslations).map(
                            ([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>

            <table className="my-4 min-w-full">
                <thead className="text-slate-500">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 border-b border-slate-300 text-left text-sm md:text-md font-medium cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {header.isPlaceholder ? null : (
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {
                                                {
                                                    asc: (
                                                        <FiChevronUp className="text-lg" />
                                                    ),
                                                    desc: (
                                                        <FiChevronDown className="text-lg" />
                                                    ),
                                                }[
                                                    (header.column.getIsSorted() as string) ||
                                                        "null"
                                                ]
                                            }
                                        </div>
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
                                    className="px-4 py-3 border-b border-slate-300 text-sm md:text-md font-semibold"
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
            <div className="flex justify-center items-center gap-5">
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <FiChevronsLeft />
                </button>
                <button
                    className={table.getCanPreviousPage() ? "" : "opacity-20"}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <FiChevronLeft />
                </button>
                <span className="text-sm">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                <button
                    className={table.getCanNextPage() ? "" : "opacity-20"}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <FiChevronRight />
                </button>
                <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <FiChevronsRight />
                </button>
            </div>
        </div>
    );
}

export default TicketsTable;
