import AddAffiliateModal from "@/components/affiliates/AddAffiliateModal";
import AffiliateDetailsModal from "@/components/affiliates/AffiliateDetailsModal";
import AffiliatesTable from "@/components/affiliates/AffiliatesTable";
import { FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAffiliates } from "@/api/affiliatesAPI";
import { Affiliates } from "@/types/affiliateTypes";
import { useAuth } from "@/hooks/useauth";
import EditAffiliateData from "@/components/affiliates/EditAffiliateData";
import BulkImportModal from "@/components/affiliates/BulkImportModal";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { Fragment } from "react";

function AffiliatesView() {
    const { data: user, isLoading: userLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery<Affiliates>({
        queryKey: ["affiliates"],
        queryFn: () => getAffiliates(),
        retry: false,
    });

    if (isLoading && userLoading) return "Loading...";

    if (data && user)
        return (
            <div className="shadow-xl rounded-lg bg-white md:px-10 p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">
                        Affiliate Management
                    </h1>
                    <div className="flex gap-2 font-bold">
                        <button
                            className="bg-black hover:opacity-80 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 transition-opacity text-sm truncate"
                            onClick={() =>
                                navigate(
                                    location.pathname + "?newAffiliate=true"
                                )
                            }
                        >
                            <FiPlus className="text-xl" />
                            Add Affiliate
                        </button>
                        <Menu
                            as="div"
                            className="relative flex-none hidden md:block"
                        >
                            <MenuButton className="block p-2.5 text-gray-500 hover:text-gray-900">
                                <span className="sr-only">options</span>
                                <FiMoreHorizontal
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </MenuButton>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none font-semibold">
                                    <MenuItem>
                                        <button
                                            onClick={() =>
                                                navigate("?bulkImport=true")
                                            }
                                            className="px-4 py-2 text-sm transition hover:underline"
                                        >
                                            Import from CSV
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    </div>
                </div>

                {data.length > 0 ? (
                    <AffiliatesTable affiliates={data} isLoading={isLoading} />
                ) : (
                    <div className="flex flex-col space-y-5 text-center mt-10">
                        <img
                            src="/affiliates.svg"
                            className="size-12 md:size-44 mx-auto"
                            alt="no affiliates yet image"
                        />
                        <h2 className="text-base md:text-xl font-bold text-slate-400">
                            Your affiliates will show up here.
                        </h2>
                    </div>
                )}
                <AddAffiliateModal />
                <AffiliateDetailsModal />
                <EditAffiliateData />
                <BulkImportModal />
            </div>
        );
}

export default AffiliatesView;
