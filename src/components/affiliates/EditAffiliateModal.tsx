import { updateAffiliate } from "@/api/affiliatesAPI";
import { affiliateUpdateFormSchema } from "@/schemas/affiliateSchema";
import { Affiliate, AffiliateUpdateFormData } from "@/types/affiliateTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorMessage from "../ErrorMessage";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { FiX } from "react-icons/fi";

type EditAffiliateModalProps = {
    affiliate: Affiliate;
};
function EditAffiliateModal({ affiliate }: EditAffiliateModalProps) {
    const navigate = useNavigate();

    const initialValues = {
        name: affiliate.name,
        email: affiliate.email,
        platform: affiliate.platform,
        status: affiliate.status,
        contractType: affiliate.contractType,
        country: affiliate.country,
        BonusAmount: affiliate.BonusAmount,
        CPA: affiliate.CPA,
        RevShare: affiliate.RevShare,
        Baseline: affiliate.Baseline,
    };

    const affiliateId = affiliate._id;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AffiliateUpdateFormData>({
        defaultValues: initialValues,
        resolver: zodResolver(affiliateUpdateFormSchema),
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateAffiliate,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            queryClient.invalidateQueries({
                queryKey: ["affiliates"],
            });
            queryClient.invalidateQueries({
                queryKey: ["affiliate", affiliateId],
            });
            toast.success(message);
            navigate(location.pathname, { replace: true });
            reset();
        },
    });

    const handleEditAffiliate = (formData: AffiliateUpdateFormData) => {
        const transformedData = {
            ...formData,
            BonusAmount: Number(formData.BonusAmount),
            CPA: Number(formData.CPA),
            RevShare: Number(formData.RevShare),
            Baseline: Number(formData.Baseline),
        };
        mutate({ affiliateId, formData: transformedData });
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
                                    Edit Affiliate
                                </DialogTitle>

                                <p className="text-base text-slate-500">
                                    Update your affiliate details below.
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
                                    onSubmit={handleSubmit(handleEditAffiliate)}
                                    noValidate
                                >
                                    <div className="flex flex-col gap-2 mt-2">
                                        <label
                                            htmlFor="name"
                                            className="font-semibold text-md"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="affiliate's name"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("name", {
                                                required: "name is required",
                                            })}
                                        />
                                        {errors.name && (
                                            <ErrorMessage>
                                                {errors.name.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="email"
                                            className="font-semibold text-md"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="affiliate's email"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("email", {
                                                required: "email is required",
                                            })}
                                        />
                                        {errors.email && (
                                            <ErrorMessage>
                                                {errors.email.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <label
                                            htmlFor="platform"
                                            className="font-semibold text-md"
                                        >
                                            Platform
                                        </label>
                                        <input
                                            id="platform"
                                            type="text"
                                            placeholder="platform"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("platform", {
                                                required:
                                                    "platform is required",
                                            })}
                                        />
                                        {errors.platform && (
                                            <ErrorMessage>
                                                {errors.platform.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="contractType"
                                            className="font-semibold text-md"
                                        >
                                            Contract Type
                                        </label>
                                        <select
                                            id="contractType"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("contractType", {
                                                required:
                                                    "contractType is required",
                                            })}
                                        >
                                            <option value="">
                                                Select Contract Type
                                            </option>
                                            <option value="CPA">CPA</option>
                                            <option value="RevShare">
                                                RevShare
                                            </option>
                                            <option value="Hybrid">
                                                Hybrid
                                            </option>
                                        </select>
                                        {errors.contractType && (
                                            <ErrorMessage>
                                                {errors.contractType.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <label
                                            htmlFor="country"
                                            className="font-semibold text-md"
                                        >
                                            Country
                                        </label>
                                        <input
                                            id="platform"
                                            type="text"
                                            placeholder="platform"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("country", {
                                                required: "country is required",
                                            })}
                                        />
                                        {errors.country && (
                                            <ErrorMessage>
                                                {errors.country.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="CPA"
                                            className="font-semibold text-md"
                                        >
                                            Bonus Amount
                                        </label>
                                        <input
                                            id="BonusAmount"
                                            type="number"
                                            placeholder="Bonus amount"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("BonusAmount")}
                                        />
                                        {errors.BonusAmount && (
                                            <ErrorMessage>
                                                {errors.BonusAmount.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="CPA"
                                            className="font-semibold text-md"
                                        >
                                            CPA
                                        </label>
                                        <input
                                            id="CPA"
                                            type="number"
                                            placeholder="CPA amount"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("CPA", {
                                                required: "CPA is required",
                                            })}
                                        />
                                        {errors.CPA && (
                                            <ErrorMessage>
                                                {errors.CPA.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="RevShare"
                                            className="font-semibold text-md"
                                        >
                                            RevShare
                                        </label>
                                        <input
                                            id="RevShare"
                                            type="number"
                                            placeholder="Revenue Share %"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("RevShare", {
                                                required:
                                                    "Revenue Share is required",
                                            })}
                                        />
                                        {errors.RevShare && (
                                            <ErrorMessage>
                                                {errors.RevShare.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <label
                                            htmlFor="baseline"
                                            className="font-semibold text-md"
                                        >
                                            Baseline Number
                                        </label>
                                        <input
                                            id="baseline"
                                            type="number"
                                            placeholder="Baseline number"
                                            className="w-full p-2 border border-gray-200 rounded-md"
                                            {...register("Baseline")}
                                        />
                                        {errors.Baseline && (
                                            <ErrorMessage>
                                                {errors.Baseline.message}
                                            </ErrorMessage>
                                        )}
                                    </div>
                                    <input
                                        type="submit"
                                        value="Edit Affiliate"
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

export default EditAffiliateModal;
