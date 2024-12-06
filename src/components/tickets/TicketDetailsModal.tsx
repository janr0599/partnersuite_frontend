import { Fragment, useEffect } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ticket, Tickets } from "@/types/ticketsTypes";
import { getTicketById, updateTicketStatus } from "@/api/ticketsAPI";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { categoryTranslations, statusTranslations } from "@/locales/en";
import CommentsPanel from "../comments/CommentsPanel";
import { isManager } from "@/utils/policies";
import { useAuth } from "@/hooks/useauth";

type TicketDetailsModalProps = {
    tickets?: Tickets;
};

export default function TickeDetailsModal({
    tickets,
}: TicketDetailsModalProps) {
    const { data: user, isLoading: userLoading } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ticketId = queryParams.get("viewTicket")!;

    const { data, isError, error } = useQuery<Ticket>({
        queryKey: ["ticket", ticketId],
        queryFn: () => getTicketById(ticketId),
        enabled: !!ticketId,
        retry: false,
    });

    const show = !!ticketId;

    useEffect(() => {
        const html = document.documentElement;

        if (show) {
            html.style.overflow = "auto"; // Allow scrolling
        }

        return () => {
            html.style.overflow = ""; // Reset on modal close
        };
    }, [show]);

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateTicketStatus,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"],
            });
            queryClient.invalidateQueries({
                queryKey: ["ticket", ticketId],
            });
            toast.success(message);
            navigate(location.pathname, { replace: true });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as Ticket["status"];

        mutate({
            ticketId,
            status,
        });
    };

    useEffect(() => {
        if (isError) {
            toast.error(error.message);
            navigate("/");
        }
    }, [isError]);

    // Calculate formattedId
    let ticketIdentifier = "";
    if (tickets) {
        const currentTicket = tickets.find((ticket) => ticket._id === ticketId);
        if (currentTicket) {
            ticketIdentifier = currentTicket.ticketId;
        }
    }

    if (userLoading) return "Loading...";

    if (data && user)
        return (
            <Transition appear show={show} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[10000]"
                    onClose={() =>
                        navigate(location.pathname, { replace: true })
                    }
                >
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all px-6 py-4">
                                    <div className="md:flex justify-between items-center mb-3 space-y-3 md:space-y-0">
                                        <div className="order-last mb-auto mr-10">
                                            <p className="text-xs text-slate-400">
                                                Created on:{" "}
                                                {formatDate(data.createdAt)}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Last update:{" "}
                                                {formatDate(data.updatedAt)}
                                            </p>
                                        </div>

                                        <div className="">
                                            <DialogTitle
                                                as="h3"
                                                className="font-black text-lg md:text-xl mb-2"
                                            >
                                                Ticket Details -{" "}
                                                {ticketIdentifier}
                                            </DialogTitle>
                                        </div>
                                    </div>

                                    <FiX
                                        className="absolute top-4 right-6 text-xl cursor-pointer"
                                        onClick={() =>
                                            navigate(location.pathname, {
                                                replace: true,
                                            })
                                        }
                                    />

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="title"
                                            className="font-semibold text-sm md:text-base"
                                        >
                                            Title
                                        </label>
                                        <p className="text-sm text-slate-500 mb-2 break-words">
                                            {data.title}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="description"
                                            className="font-semibold text-sm md:text-base"
                                        >
                                            Description
                                        </label>
                                        <p className="text-sm text-slate-500 mb-2 break-words">
                                            {data.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="category"
                                            className="font-semibold text-sm md:text-base"
                                        >
                                            Category
                                        </label>
                                        <p className="text-sm text-slate-500 mb-2 max-w-[350px]">
                                            {
                                                categoryTranslations[
                                                    data.category
                                                ]
                                            }
                                        </p>
                                    </div>

                                    {isManager(user) ? (
                                        <div className="mb-2 space-y-3">
                                            <label className="font-semibold block text-sm md:text-base">
                                                Status:
                                            </label>
                                            <select
                                                className="p-2 bg-white border border-gray-300 rounded-lg text-sm text-slate-700 min-w-[120px]"
                                                defaultValue={data.status}
                                                onChange={handleChange}
                                            >
                                                {Object.entries(
                                                    statusTranslations
                                                ).map(([key, value]) => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="mb-2 flex flex-col gap-2">
                                            <label
                                                htmlFor="status"
                                                className="font-semibold text-sm md:text-base"
                                            >
                                                Status
                                            </label>
                                            <p className="text-sm text-slate-500 max-w-[350px]">
                                                {
                                                    statusTranslations[
                                                        data.status
                                                    ]
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <p className="font-bold text-xl  text-center">
                                        Comments
                                    </p>

                                    <CommentsPanel
                                        comments={data.comments}
                                        ticket={data}
                                    />
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
}
