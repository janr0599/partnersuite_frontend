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

import { formatDate } from "@/utils/utils";
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
    FiSearch,
    FiTrash2,
    FiXCircle,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    deleteTopUpRequest,
    updateTopUpRequestStatus,
} from "@/api/topUpRequestsAPI";
import { TopUpRequest, TopUpRequests } from "@/types/topUpRequestsTypes";
import { TopUpRequestsstatusTranslations } from "@/locales/en";
import { AuthenticatedUser } from "@/types/authTypes";
import { useMemo, useState } from "react";
import { isManager } from "@/utils/policies";

type TopUpRequestsTableProps = {
    topUpRequests: TopUpRequests;
    isLoading: boolean;
    user: AuthenticatedUser;
};

function TopUpRequestsTable({
    topUpRequests,
    isLoading,
    user,
}: TopUpRequestsTableProps) {
    console.log(topUpRequests);
    const canDelete = useMemo(
        () => user._id === topUpRequests[0].createdBy._id,
        [user]
    );

    const queryclient = useQueryClient();
    const { mutate: mutateDeleteTicket } = useMutation({
        mutationFn: deleteTopUpRequest,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryclient.invalidateQueries({
                queryKey: ["topUpRequests"],
            });
        },
    });

    const { mutate: mutateUpdateTopUpRequestStatus } = useMutation({
        mutationFn: updateTopUpRequestStatus,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryclient.invalidateQueries({
                queryKey: ["topUpRequests"],
            });
        },
    });

    const handleUpdateTopUpRequestStatus = (
        topUpRequestId: TopUpRequest["_id"],
        status: TopUpRequest["status"]
    ) => {
        mutateUpdateTopUpRequestStatus({
            topUpRequestId,
            status,
        });
    };

    const handleDeleteTopUpRequest = (topUpRequestId: TopUpRequest["_id"]) => {
        Swal.fire({
            title: "Delete top-up request?",
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
                    topUpRequestId,
                });
            }
        });
    };

    const statusFilter: FilterFn<TopUpRequest> = (
        row,
        columnId,
        filterValue
    ) => {
        if (!filterValue) return true; // Show all rows if no filter is applied
        return row.getValue<string>(columnId) === filterValue; // Match row's status
    };

    const filterFns = {
        statusFilter,
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        table.getColumn("status")?.setFilterValue(e.target.value);
    };

    const columns: ColumnDef<TopUpRequest>[] = [
        {
            header: "ID",
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
            header: "Amount",
            accessorKey: "BonusAmount",
            cell: ({ cell }) => {
                return (
                    <div className="flex flex-col gap-2">
                        <p>{cell.getValue<number>()} €</p>
                    </div>
                );
            },
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (info) =>
                TopUpRequestsstatusTranslations[info.getValue<string>()],
            filterFn: statusFilter, // Use the custom filter
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
                    {isManager(user) && (
                        <>
                            <button
                                className="bg-green-400 border border-slate-300 hover:bg-green-500 rounded-md px-4 py-2 text-sm font-medium transition-colors text-white"
                                onClick={() => {
                                    handleUpdateTopUpRequestStatus(
                                        row.original._id,
                                        "Approved"
                                    );
                                }}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <FiCheckCircle className="text-white font-medium" />
                                    Approve
                                </span>
                            </button>
                            <button
                                className="bg-red-400 border border-slate-300 hover:bg-red-500 rounded-md px-4 py-2 text-sm font-medium transition-colors text-white"
                                onClick={() => {
                                    handleUpdateTopUpRequestStatus(
                                        row.original._id,
                                        "Rejected"
                                    );
                                }}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <FiXCircle className="text-white font-medium" />
                                    Reject
                                </span>
                            </button>
                        </>
                    )}

                    {canDelete && (
                        <button
                            className="border border-slate-300 hover:bg-slate-200 rounded-md p-2 text-sm font-medium transition-colors group"
                            onClick={() => {
                                handleDeleteTopUpRequest(row.original._id);
                            }}
                        >
                            <FiTrash2 className="size-5 group-hover:text-red-500 hover:cursor-pointer transition-colors" />
                        </button>
                    )}
                </>
            ),
        },
    ];

    const [filtering, setFiltering] = useState("");

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data: topUpRequests || [],
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
            {isManager(user) && (
                <div className="flex flex-col sm:flex-row gap-2 md:gap-6 font-normal items-start flex-1 w-full mt-1 justify-between">
                    <div className="hidden md:block -mb-2"></div>
                    <div className="flex flex-col md:flex-row gap-2 p-1 md:p-0">
                        <div className="relative flex items-center flex-1 min-w-[250px] md:w-auto w-3/4">
                            <FiSearch className="absolute left-3 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search All columns..."
                                className="w-full bg-white border border-slate-300 rounded-md pl-10 py-2 text-sm text-gray-500 outline-none"
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                            />
                        </div>
                        <div className="md:w-1/4 min-w-36 ">
                            <select
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm text-gray-500 outline-none"
                                onChange={handleStatusChange}
                                value={
                                    (table
                                        .getColumn("status")
                                        ?.getFilterValue() as string) || ""
                                }
                            >
                                <option value="">All</option>
                                {Object.entries(
                                    TopUpRequestsstatusTranslations
                                ).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <table className="my-4 min-w-full">
                <thead className="text-slate-500">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={`${
                                        header.id === "actions"
                                            ? "cursor-default"
                                            : "cursor-pointer"
                                    } px-4 py-2 border-b border-slate-300 text-left text-sm md:text-md font-medium select-none`}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {header.isPlaceholder ? null : (
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {!header.column.getIsSorted() &&
                                                header.id !== "actions" && (
                                                    <span className="">
                                                        <FiChevronUp className="text-sm -mb-2" />
                                                        <FiChevronDown className="text-sm" />
                                                    </span>
                                                )}

                                            {
                                                {
                                                    asc: (
                                                        <FiChevronUp className="text-sm" />
                                                    ),
                                                    desc: (
                                                        <FiChevronDown className="text-sm" />
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
                        <tr
                            key={row.id}
                            className="hover:bg-slate-100 transition-colors"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-2 border-b border-slate-300 text-sm font-medium
                                  truncate"
                                >
                                    <div className="inline-flex items-center gap-2">
                                        {cell.getValue<string>() ===
                                            "Pending" && (
                                            <FiClock className="text-sm text-yellow-600" />
                                        )}
                                        {cell.getValue<string>() ===
                                            "Rejected" && (
                                            <FiAlertCircle className="text-sm text-red-600" />
                                        )}
                                        {cell.getValue<string>() ===
                                            "Approved" && (
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
                    className={table.getCanPreviousPage() ? "" : "opacity-20"}
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
                    {table.getState().pagination.pageIndex + 1} of{" "}
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
                    className={table.getCanNextPage() ? "" : "opacity-20"}
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <FiChevronsRight />
                </button>
            </div>
        </div>
    );
}

export default TopUpRequestsTable;
