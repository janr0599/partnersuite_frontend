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
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { Affiliate, Affiliates } from "@/types/affiliateTypes";
import { useNavigate } from "react-router-dom";
import {
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsLeft,
    FiChevronsRight,
    FiChevronUp,
    FiEdit,
    FiMoreHorizontal,
    FiSearch,
    FiTrash2,
    FiUsers,
} from "react-icons/fi";
import { deleteAffiliate } from "@/api/affiliatesAPI";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Fragment, useState } from "react";
import { AffiliateStatusTranslations } from "@/locales/en";

type AffiliatesTableProps = {
    affiliates: Affiliates;
    isLoading: boolean;
};

function AffiliatesTable({ affiliates, isLoading }: AffiliatesTableProps) {
    const navigate = useNavigate();

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
                title: "text-black font-bold text-left w-full p-3 rounded-md text-2xl",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                mutateDeleteAffiliate({
                    affiliateId,
                });
            }
        });
    };

    const statusFilter: FilterFn<Affiliate> = (row, columnId, filterValue) => {
        if (!filterValue) return true; // Show all rows if no filter is applied
        return row.getValue<string>(columnId) === filterValue; // Match row's status
    };

    const filterFns = {
        statusFilter,
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        table.getColumn("status")?.setFilterValue(e.target.value);
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
            header: "Country",
            accessorKey: "country",
        },
        {
            header: "Platform",
            accessorKey: "platform",
        },
        {
            header: "Contract",
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
                AffiliateStatusTranslations[info.getValue<string>()],
            filterFn: statusFilter, // Use the custom filter
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
                        Details
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

    const [filtering, setFiltering] = useState("");

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data: affiliates || [],
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
        filterFns,
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }
    return (
        <div className="mt-4 overflow-x-auto">
            <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center font-semibold ml-auto gap-4 p-1">
                <p className="text-slate-500 inline-flex gap-2 items-center">
                    <FiUsers /> Total: {affiliates?.length}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-6 font-normal items-start md:items-center flex-1 w-full lg:max-w-md mt-1">
                    <div className="relative flex items-center flex-1 min-w-[250px] md:w-auto">
                        <FiSearch className="absolute left-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search All columns..."
                            className="w-full bg-white border border-slate-300 rounded-md pl-10 py-2 text-gray-500 outline-none"
                            value={filtering}
                            onChange={(e) => setFiltering(e.target.value)}
                        />
                    </div>
                    <div className="md:w-1/2 min-w-36 flex items-center gap-2">
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
                            {Object.entries(AffiliateStatusTranslations).map(
                                ([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                )
                            )}
                        </select>
                        <Menu
                            as="div"
                            className="relative flex-none hidden md:block"
                        >
                            <MenuButton className="block p-2.5 text-gray-500 hover:text-gray-900">
                                <span className="sr-only">options</span>
                                <FiMoreHorizontal
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </MenuButton>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none font-semibold">
                                    <MenuItem>
                                        <button
                                            onClick={() =>
                                                navigate("?bulkImport=true")
                                            }
                                            className="px-4 py-2 text-sm transition hover:underline"
                                        >
                                            Import from CSV
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
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
                                    } px-2 py-2 border-b border-slate-300 text-left text-sm md:text-md font-medium select-none`}
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
                            onClick={() =>
                                navigate(
                                    location.pathname +
                                        `?viewAffiliate=${row.original._id}`
                                )
                            }
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="p-2 border-b border-slate-300 text-sm font-medium truncate"
                                >
                                    <div
                                        className={` ${
                                            cell.column.id === "status"
                                                ? cell.getValue<string>() ===
                                                  "active"
                                                    ? "bg-green-400 text-white py-1 px-2 rounded-full"
                                                    : "bg-gray-400 text-white py-1 px-2 rounded-full"
                                                : ""
                                        } inline-flex items-center gap-2`}
                                    >
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

export default AffiliatesTable;
