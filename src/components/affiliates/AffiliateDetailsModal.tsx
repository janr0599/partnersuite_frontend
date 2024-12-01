import { Fragment, useEffect } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { FiX, FiUser } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAffiliateById, updateAffiliateStatus } from "@/api/affiliatesAPI";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useauth";
import { Affiliate } from "@/types/affiliateTypes";
import { AffiliateStatusTranslations } from "@/locales/en";

export default function AffiliateModalDetails() {
    const { data: user, isLoading: userLoading } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const affiliateId = queryParams.get("viewAffiliate")!;

    const show = !!affiliateId;

    const { data, isError, error } = useQuery<Affiliate>({
        queryKey: ["affiliate", affiliateId],
        queryFn: () => getAffiliateById(affiliateId),
        enabled: !!affiliateId,
        retry: false,
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateAffiliateStatus,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            queryClient.invalidateQueries({
                queryKey: ["affiliates"],
            });
            toast.success(message);
            navigate(location.pathname, { replace: true });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as Affiliate["status"];

        mutate({
            affiliateId,
            status,
        });
    };

    useEffect(() => {
        if (isError) {
            toast.error(error.message);
            navigate("/");
        }
    }, [isError]);

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
                                <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6 md:p-8 space-y-4 md:space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-full  size-14 md:size-20 bg-slate-200 inline-flex items-center justify-center">
                                                {/* <img src={""} alt="avatar" /> */}
                                                <FiUser className="text-xl md:text-3xl" />
                                            </div>
                                            <div className="">
                                                <DialogTitle
                                                    as="h3"
                                                    className="font-black text-base md:text-xl"
                                                >
                                                    {data.name}
                                                </DialogTitle>
                                                <p className="text-xs md:text-sm text-slate-500">
                                                    {data.email}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs md:text-sm bg-black text-white p-2 rounded-full w-fit font-bold">
                                            {data.platform}
                                        </p>
                                    </div>
                                    <FiX
                                        className="absolute -top-2 right-3 md:right-6 text-xl cursor-pointer"
                                        onClick={() =>
                                            navigate(location.pathname, {
                                                replace: true,
                                            })
                                        }
                                    />

                                    <div className="flex  gap-2 items-center justify-between flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="platform"
                                                className="font-semibold text-sm md:text-base"
                                            >
                                                Contract:
                                            </label>
                                            <p className="text-sm md:text-base">
                                                {data.contractType}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="platform"
                                                className="font-semibold text-sm md:text-base"
                                            >
                                                Country:
                                            </label>
                                            <p className="text-sm md:text-base">
                                                {data.country}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 -ml-2">
                                            <label className="font-semibold p-2 text-sm md:text-base">
                                                Status:
                                            </label>
                                            <select
                                                className="p-1 bg-white border border-gray-300 rounded-lg text-sm text-slate-700 min-w-[100px]"
                                                defaultValue={data.status}
                                                onChange={handleChange}
                                            >
                                                {Object.entries(
                                                    AffiliateStatusTranslations
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
                                    </div>

                                    <div className="flex items-center gap-2 justify-between flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="platform"
                                                className="font-semibold text-sm md:text-base"
                                            >
                                                CPA:
                                            </label>
                                            <p className="text-sm md:text-base">
                                                {data.CPA} €
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="platform"
                                                className="font-semibold text-sm md:text-base"
                                            >
                                                RevShare:
                                            </label>
                                            <p className="text-sm md:text-base">
                                                {data.RevShare} %
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="platform"
                                                className="font-semibold text-sm md:text-base"
                                            >
                                                Baseline:
                                            </label>
                                            <p className="text-sm md:text-base">
                                                {data.Baseline} €
                                            </p>
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
