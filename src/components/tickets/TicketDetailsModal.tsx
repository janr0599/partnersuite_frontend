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
import { statusTranslations } from "@/locales/en";
import CommentsPanel from "../comments/CommentsPanel";

type TicketDetailsModalProps = {
    tickets: Tickets;
};

export default function TaskModalDetails({ tickets }: TicketDetailsModalProps) {
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ticketId = queryParams.get("viewTicket")!;

    const show = !!ticketId;

    const { data, isError, error } = useQuery<Ticket>({
        queryKey: ["ticket", ticketId],
        queryFn: () => getTicketById(ticketId),
        enabled: !!ticketId,
        retry: false,
    });

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
    let formattedId = "";
    if (tickets) {
        const ticketIndex =
            tickets.findIndex((ticket) => ticket._id === ticketId) + 1;
        formattedId = `T-${ticketIndex.toString().padStart(4, "0")}`;
    }

    if (data)
        return (
            <Transition appear show={show} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
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
                                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6">
                                    <div className="md:flex justify-between items-center mb-5">
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
                                                className="font-black text-xl mb-2"
                                            >
                                                Ticket Details - {formattedId}
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
                                            className="font-semibold text-md"
                                        >
                                            Title
                                        </label>
                                        <p className="text-sm text-slate-500 mb-2 max-w-[350px]">
                                            {data.title}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="title"
                                            className="font-semibold text-md"
                                        >
                                            Description
                                        </label>
                                        <p className="text-sm text-slate-500 mb-2">
                                            {data.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="title"
                                            className="font-semibold text-md"
                                        >
                                            Category
                                        </label>
                                        <p className="text-sm text-slate-500 mb-2 max-w-[350px]">
                                            {data.category}
                                        </p>
                                    </div>

                                    <div className="mb-10 space-y-3">
                                        <label className="font-semibold block">
                                            Status:
                                        </label>
                                        <select
                                            className="w-1/4 p-2 bg-white border border-gray-300 rounded-lg"
                                            defaultValue={data.status}
                                            onChange={handleChange}
                                        >
                                            {Object.entries(
                                                statusTranslations
                                            ).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <CommentsPanel comments={data.comments} />
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
}
