import AddAffiliateModal from "@/components/affiliates/AddAffiliateModal";
import AffiliateDetailsModal from "@/components/affiliates/AffiliateDetailsModal";
import AffiliatesTable from "@/components/affiliates/AffiliatesTable";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAffiliates } from "@/api/affiliatesAPI";
import { Affiliates } from "@/types/affiliateTypes";
import { useAuth } from "@/hooks/useauth";
import EditAffiliateData from "@/components/affiliates/EditAffiliateData";
import BulkImportModal from "@/components/affiliates/BulkImportModal";

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
                    <div className="flex gap-6 font-bold">
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
