import { Fragment } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AffiliateForm from "./AffiliateForm";
import { AffiliateFormData } from "@/types/affiliateTypes";
import { affiliateFormSchema } from "@/schemas/affiliateSchema";
import { addAffiliate } from "@/api/affiliatesAPI";

export default function AddAffiliateModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const affiliateModal = queryParams.get("newAffiliate");

    const show = affiliateModal ? true : false;
    const initialValues: AffiliateFormData = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        platform: "",
        contractType: "",
        BonusAmount: 0,
        CPA: 0,
        RevShare: 0,
        Baseline: 0,
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        setFocus,
    } = useForm<AffiliateFormData>({
        defaultValues: initialValues,
        resolver: zodResolver(affiliateFormSchema),
        mode: "onChange",
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: addAffiliate,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            queryClient.invalidateQueries({
                queryKey: ["affiliates"],
            });
            toast.success(message);
            navigate(location.pathname, { replace: true });
            reset();
        },
    });

    const handleAddAffiliate = (formData: AffiliateFormData) => {
        const transformedData = {
            ...formData,
            BonusAmount: Number(formData.BonusAmount),
            CPA: Number(formData.CPA),
            RevShare: Number(formData.RevShare),
            Baseline: Number(formData.Baseline),
        };
        mutate(transformedData);
        console.log(formData);
    };

    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
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
                                        Add New Affiliate
                                    </DialogTitle>

                                    <p className="text-base text-slate-500">
                                        Fill out the form below to create and
                                        add a new affiliate.
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
                                            handleAddAffiliate
                                        )}
                                        noValidate
                                    >
                                        <AffiliateForm
                                            register={register}
                                            errors={errors}
                                            setFocus={setFocus}
                                        />
                                        <input
                                            type="submit"
                                            value="Add Affiliate"
                                            disabled={!isValid}
                                            className={`bg-black hover:opacity-80 w-full p-3 text-white capitalize font-bold cursor-pointer transition-opacity rounded-md ${
                                                !isValid &&
                                                "opacity-50 cursor-not-allowed hover:opacity-50"
                                            }`}
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
