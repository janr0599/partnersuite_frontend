import { Fragment, useState } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
} from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Papa from "papaparse";
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
        onError: (error: any) => toast.error(error.message),
        onSuccess: (message: any) => {
            queryClient.invalidateQueries({
                queryKey: ["affiliates"],
            });
            toast.success(message);
            navigate(location.pathname, { replace: true });
            setMappingData({
                csvHeaders: [],
                file: null,
                showMappingUI: false,
            });
        },
    });

    // **State to Manage Mapping UI Visibility and Data**
    const [mappingData, setMappingData] = useState<{
        csvHeaders: string[];
        file: File | null;
        showMappingUI: boolean;
    }>({
        csvHeaders: [],
        file: null,
        showMappingUI: false,
    });

    const expectedFields = [
        "name",
        "email",
        "password",
        "confirmPassword",
        "country",
        "platform",
        "contractType",
        "CPA",
        "RevShare",
        "BonusAmount",
        "Baseline",
    ];

    const handleFileUpload = (file: File) => {
        Papa.parse(file, {
            header: true,
            preview: 1, // Only read the first row
            complete: (results) => {
                const csvHeaders = results.meta.fields!;
                // **Update State to Show Mapping UI**
                setMappingData({
                    csvHeaders,
                    file,
                    showMappingUI: true,
                });
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
                        <DialogPanel className="relative w-full max-w-lg bg-white rounded-lg p-6">
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
                                {/* Show Mapping UI if Needed */}
                                {mappingData.showMappingUI ? (
                                    <MappingUI
                                        expectedFields={expectedFields}
                                        csvHeaders={mappingData.csvHeaders}
                                        file={mappingData.file!}
                                        mutate={mutate}
                                        onCancel={() =>
                                            setMappingData({
                                                csvHeaders: [],
                                                file: null,
                                                showMappingUI: false,
                                            })
                                        }
                                    />
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => {
                                                if (
                                                    e.target.files &&
                                                    e.target.files[0]
                                                ) {
                                                    handleFileUpload(
                                                        e.target.files[0]
                                                    );
                                                }
                                            }}
                                            className="block w-full p-3 border rounded-md"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Upload a CSV file with the following
                                            columns: name, email, password,
                                            confirmPassword, country, platform,
                                            contractType, CPA, RevShare,
                                            BonusAmount, Baseline
                                        </p>
                                    </>
                                )}
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

// **MappingUI Component**
interface MappingUIProps {
    expectedFields: string[];
    csvHeaders: string[];
    file: File;
    mutate: any;
    onCancel: any;
}

function MappingUI({
    expectedFields,
    csvHeaders,
    file,
    mutate,
    onCancel,
}: MappingUIProps) {
    const initialMapping = expectedFields.reduce((acc, field) => {
        if (csvHeaders.includes(field)) {
            acc[field] = field;
        }
        return acc;
    }, {} as { [key: string]: string });

    const [fieldMapping, setFieldMapping] = useState<{ [key: string]: string }>(
        initialMapping
    );

    const processCSVFile = () => {
        const unmappedFields = expectedFields.filter(
            (field) => !fieldMapping[field]
        );
        if (unmappedFields.length > 0) {
            toast.error(
                `Please map all required fields: ${unmappedFields.join(", ")}`
            );
            return;
        }

        Papa.parse<AffiliateCSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const mappedData = result.data.map((row) => {
                    const mappedRow: AffiliateCSVRow = {} as AffiliateCSVRow;
                    for (const [expectedField, csvField] of Object.entries(
                        fieldMapping
                    )) {
                        mappedRow[expectedField as keyof AffiliateCSVRow] =
                            row[csvField as keyof AffiliateCSVRow];
                    }
                    return mappedRow;
                });
                // Proceed to send mappedData to the server
                mutate(mappedData);
            },
            error: (error: Error) =>
                toast.error(`File parsing error: ${error.message}`),
        });
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Map Your CSV Columns</h2>
            <div className="grid grid-cols-4 gap-4">
                {expectedFields.map((expectedField) => (
                    <div key={expectedField} className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            {expectedField}
                        </label>
                        <select
                            value={fieldMapping[expectedField] || ""}
                            onChange={(e) =>
                                setFieldMapping({
                                    ...fieldMapping,
                                    [expectedField]: e.target.value,
                                })
                            }
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select</option>
                            {csvHeaders.map((header) => (
                                <option key={header} value={header}>
                                    {header}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex justify-start gap-4">
                <button
                    onClick={processCSVFile}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Import
                </button>
                <button
                    onClick={onCancel}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
