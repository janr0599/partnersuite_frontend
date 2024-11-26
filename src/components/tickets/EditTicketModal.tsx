import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { FiX } from "react-icons/fi";
import { Ticket, TicketFormData } from "@/types/ticketsTypes";
import { ticketFormSchema } from "@/schemas/ticketsShemas";
import { updateTicket } from "@/api/ticketsAPI";
import TicketForm from "./TicketForm";

type EditAffiliateModalProps = {
    ticket: Ticket;
};
function EditTicketModal({ ticket }: EditAffiliateModalProps) {
    const navigate = useNavigate();

    const initialValues = {
        title: ticket.title,
        category: ticket.category,
        description: ticket.description,
    };

    const ticketId = ticket._id;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TicketFormData>({
        defaultValues: initialValues,
        resolver: zodResolver(ticketFormSchema),
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateTicket,
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
            reset();
        },
    });

    const handleEditTicket = (formData: TicketFormData) => {
        mutate({ formData, ticketId });
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[10000]"
                onClose={() => {
                    navigate(location.pathname, { replace: true });
                }}
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
                            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6 relative">
                                <DialogTitle
                                    as="h3"
                                    className="font-bold text-2xl"
                                >
                                    Edit Ticket
                                </DialogTitle>

                                <p className="text-base text-slate-500">
                                    Update your Ticket details below.
                                </p>

                                <FiX
                                    className="absolute top-4 right-8 text-xl cursor-pointer"
                                    onClick={() =>
                                        navigate(location.pathname, {
                                            replace: true,
                                        })
                                    }
                                />
                                <form
                                    className="mt-5 space-y-3"
                                    onSubmit={handleSubmit(handleEditTicket)}
                                    noValidate
                                >
                                    <TicketForm
                                        register={register}
                                        errors={errors}
                                    />

                                    <input
                                        type="submit"
                                        value="Edit Ticket"
                                        className="bg-black hover:opacity-80 w-full p-3 text-white capitalize font-bold cursor-pointer transition-opacity rounded-md"
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default EditTicketModal;
