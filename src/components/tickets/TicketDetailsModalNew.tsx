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
import { Ticket } from "@/types/ticketsTypes";
import { getTicketById, updateTicketStatus } from "@/api/ticketsAPI";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { statusTranslations } from "@/locales/en";
import CommentsPanel from "../comments/CommentsPanel";
import { useAuth } from "@/hooks/useauth";
import { isManager } from "@/utils/policies";

export default function TicketDetailsModal() {
    const { data: user, isLoading: userLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ticketId = queryParams.get("viewTicket");

    const { data, isError, error } = useQuery<Ticket>({
        queryKey: ["ticket", ticketId],
        queryFn: () => getTicketById(ticketId!),
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
            queryClient.invalidateQueries({
                queryKey: ["ticket", ticketId],
            });
            toast.success(message);
            navigate(location.pathname, { replace: true });
        },
    });

    useEffect(() => {
        if (isError) {
            toast.error((error as Error).message);
            navigate("/");
        }
    }, [isError, error, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as Ticket["status"];
        mutate({ ticketId: ticketId!, status });
    };

    const closeModal = () => navigate(location.pathname, { replace: true });

    if (userLoading || !data) return null;

    if (data && user)
        return (
            <Transition appear show={!!ticketId} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[10000]"
                    onClose={closeModal}
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
                                <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 md:p-8 shadow-xl transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <DialogTitle
                                            as="h3"
                                            className="text-lg font-bold"
                                        >
                                            Ticket Details
                                        </DialogTitle>
                                        <FiX
                                            className="text-xl cursor-pointer"
                                            onClick={closeModal}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                <strong>Created on:</strong>{" "}
                                                {formatDate(data.createdAt)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                <strong>Last updated:</strong>{" "}
                                                {formatDate(data.updatedAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="font-semibold">
                                                Title:
                                            </label>
                                            <p className="text-sm text-gray-700">
                                                {data.title}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="font-semibold">
                                                Description:
                                            </label>
                                            <p className="text-sm text-gray-700">
                                                {data.description}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="font-semibold">
                                                Status:
                                            </label>
                                            {isManager(user) ? (
                                                <select
                                                    className="p-2 bg-white border border-gray-300 rounded-md text-sm"
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
                                            ) : (
                                                <p className="text-sm text-gray-700">
                                                    {
                                                        statusTranslations[
                                                            data.status
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold">
                                                Comments:
                                            </p>
                                            <CommentsPanel
                                                comments={data.comments}
                                                ticket={data}
                                            />
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
}
