import { Fragment, useState } from "react";
import {
    Dialog,
    DialogTitle,
    Transition,
    TransitionChild,
    DialogPanel,
} from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema } from "@/schemas/ticketsShemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createTicket } from "@/api/ticketsAPI";
import { TicketFormData } from "@/types/ticketsTypes";
import TicketForm from "./TicketForm";

export default function CreateTicketModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modalTask = queryParams.get("newTicket");

    const show = modalTask ? true : false;

    const initialValues: TicketFormData = {
        title: "",
        description: "",
        category: "", //
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setFocus,
    } = useForm<TicketFormData>({
        defaultValues: initialValues,
        resolver: zodResolver(ticketFormSchema),
    });

    const [file, setFile] = useState<string>("");

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: createTicket,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"],
            });
            toast.success(message);
            navigate(location.pathname, { replace: true });
            reset();
            setFile("");
        },
    });

    const handleCreateTicket = (formData: TicketFormData) => {
        mutate({
            ...formData,
            file,
        });
    };

    return (
        <>
            <Transition appear show={show} as={Fragment}>
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
                                        Create New Ticket
                                    </DialogTitle>

                                    <p className="text-base text-slate-500">
                                        Fill out the form below to create a new
                                        support ticket.
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
                                        onSubmit={handleSubmit(
                                            handleCreateTicket
                                        )}
                                        noValidate
                                    >
                                        <TicketForm
                                            register={register}
                                            errors={errors}
                                            setFocus={setFocus}
                                            setFile={setFile}
                                        />
                                        <input
                                            type="submit"
                                            value="Submit Ticket"
                                            className=" bg-black hover:opacity-80 w-full p-3 text-white capitalize font-bold cursor-pointer transition-opacity rounded-md"
                                        />
                                    </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
