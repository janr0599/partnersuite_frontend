import { Fragment } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
} from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Papa, { ParseResult } from "papaparse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { bulkAddAffiliates } from "@/api/affiliatesAPI";

type AffiliateCSVRow = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    platform: string;
    contractType: string;
    country: string;
    BonusAmount: string; // Use string since CSV values are parsed as strings.
    CPA: string;
    RevShare: string;
    Baseline: string;
};

export default function BulkImportModal() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const addBulkModal = queryParams.get("bulkImport");
    const queryClient = useQueryClient();

    const show = addBulkModal ? true : false;

    const { mutate } = useMutation({
        mutationFn: bulkAddAffiliates,
        onError: (error) => toast.error(error.message),
        onSuccess: (message) => {
            queryClient.invalidateQueries({
                queryKey: ["affiliates"],
            });
            toast.success(message);
            navigate(location.pathname, { replace: true });
        },
    });

    const handleFileUpload = (file: File) => {
        Papa.parse<AffiliateCSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result: ParseResult<AffiliateCSVRow>) => {
                const rows = result.data;
                console.log(rows);
                mutate(rows); // Adjust `mutate` to handle the parsed rows appropriately.
            },
            error: (error: Error) =>
                toast.error(`File parsing error: ${error.message}`),
        });
    };

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[10000]"
                onClose={() => navigate(location.pathname, { replace: true })}
            >
                <div className="fixed inset-0 bg-black/60" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-lg bg-white rounded-lg p-6">
                            <DialogTitle className="text-xl font-bold">
                                Bulk Import Affiliates
                            </DialogTitle>
                            <FiX
                                className="absolute top-4 right-6 text-xl cursor-pointer"
                                onClick={() =>
                                    navigate(location.pathname, {
                                        replace: true,
                                    })
                                }
                            />
                            <div className="mt-4 space-y-3">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => {
                                        if (
                                            e.target.files &&
                                            e.target.files[0]
                                        ) {
                                            handleFileUpload(e.target.files[0]);
                                        }
                                    }}
                                    className="block w-full p-3 border rounded-md"
                                />
                                <p className="text-sm text-gray-500">
                                    Upload a CSV file with the following
                                    columns: Name, Email, Password, Confirm
                                    Password, Platform, Contract Type, Country,
                                    Bonus Amount, CPA, Rev Share, Baseline.
                                </p>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
