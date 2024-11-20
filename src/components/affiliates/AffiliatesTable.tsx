import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Affiliate, Affiliates } from "@/types/affiliateTypes";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { deleteAffiliate } from "@/api/affiliatesAPI";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type AffiliatesTableProps = {
    affiliates: Affiliates;
    isLoading: boolean;
};

function AffiliatesTable({ affiliates, isLoading }: AffiliatesTableProps) {
    const navigate = useNavigate();
    console.log(affiliates);

    const queryclient = useQueryClient();
    const { mutate: mutateDeleteAffiliate } = useMutation({
        mutationFn: deleteAffiliate,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryclient.invalidateQueries({
                queryKey: ["affiliates"],
            });
        },
    });

    const handleDeleteAffiliate = (affiliateId: Affiliate["_id"]) => {
        Swal.fire({
            title: "Delete affiliate?",
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
                mutateDeleteAffiliate({
                    affiliateId,
                });
            }
        });
    };

    const columns: ColumnDef<Affiliate>[] = [
        {
            header: "Affiliate",
            accessorKey: "name",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Platform",
            accessorKey: "platform",
        },
        {
            header: "Contract Type",
            accessorKey: "contractType",
        },
        {
            header: "CPA",
            accessorKey: "CPA",
            cell: ({ cell }) => {
                return (
                    <div className="flex flex-col gap-2">
                        <p>{cell.getValue<number>()} €</p>
                    </div>
                );
            },
        },
        {
            header: "RevShare",
            accessorKey: "RevShare",
            cell: ({ cell }) => {
                return (
                    <div className="flex flex-col gap-2">
                        <p>{cell.getValue<number>()} %</p>
                    </div>
                );
            },
        },
        {
            header: "Baseline",
            accessorKey: "Baseline",
        },
        {
            header: "Status",
            accessorKey: "status",
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
                                    `?viewAffiliate=${row.original._id}`
                            )
                        }
                    >
                        View Details
                    </button>

                    <button
                        className="border border-slate-300 hover:bg-slate-200 rounded-md p-2 text-sm font-medium transition-colors group"
                        onClick={() =>
                            navigate(
                                location.pathname +
                                    `?editAffiliate=${row.original._id}`
                            )
                        }
                    >
                        <FiEdit className="size-5 group-hover:text-indigo-500 cursor-pointer transition-colors" />
                    </button>
                    <button
                        className="border border-slate-300 hover:bg-slate-200 rounded-md p-2 text-sm font-medium transition-colors group"
                        onClick={() => handleDeleteAffiliate(row.original._id)}
                    >
                        <FiTrash2 className="size-5 group-hover:text-red-500 hover:cursor-pointer transition-colors" />
                    </button>
                </>
            ),
        },
    ];

    const table = useReactTable({
        data: affiliates || [],
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

export default AffiliatesTable;
