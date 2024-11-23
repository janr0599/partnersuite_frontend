import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { formatDate } from "@/utils/utils";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
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
import { useMemo } from "react";
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

    const columns: ColumnDef<TopUpRequest>[] = [
        {
            header: "Request ID",
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
            cell: (info) => {
                return TopUpRequestsstatusTranslations[info.getValue<string>()];
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

    const table = useReactTable({
        data: topUpRequests || [],
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
        </div>
    );
}

export default TopUpRequestsTable;
