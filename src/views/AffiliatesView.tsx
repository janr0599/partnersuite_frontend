import AddAffiliateModal from "@/components/affiliates/AddAffiliateModal";
import AffiliateDetailsModal from "@/components/affiliates/AffiliateDetailsModal";
import AffiliatesTable from "@/components/affiliates/AffiliatesTable";
import { FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAffiliates } from "@/api/affiliatesAPI";
import { Affiliates } from "@/types/affiliateTypes";
import { useAuth } from "@/hooks/useauth";
import { AffiliateStatusTranslations } from "@/locales/en";
import EditAffiliateData from "@/components/affiliates/EditAffiliateData";

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
            <div className="shadow-xl rounded-lg bg-white p-10 space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">
                        Affiliate Management
                    </h1>
                    <div className="flex gap-6 font-bold">
                        <button
                            className="bg-black hover:opacity-80 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 transition-opacity"
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
                <div className="w-full flex justify-between items-center font-semibold ml-auto pl-4">
                    <p className="text-slate-500 inline-flex gap-2 items-center">
                        <FiUsers /> {data?.length}
                    </p>
                    <div className="flex gap-6">
                        <div className="inline-flex gap-2 items-center">
                            <FiSearch className="text-gray-500" />

                            <input
                                type="text"
                                placeholder="Search Affiliates..."
                                className="bg-ehite p-2 rounded-md border border-slate-300 outline-none text-gray-500 text-sm"
                            />
                        </div>

                        <select
                            className="w-1/2 p-2 bg-white border border-slate-300 rounded-lg text-sm text-gray-500 outline-none"
                            onChange={() => {}}
                        >
                            <option value="all">All Statuses</option>
                            {Object.entries(AffiliateStatusTranslations).map(
                                ([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
                {data.length === 0 ? (
                    <div className="text-lg mt-10 text-slate-500">
                        Your affiliates will show up here
                    </div>
                ) : (
                    <AffiliatesTable affiliates={data} isLoading={isLoading} />
                )}
                <AddAffiliateModal />
                <AffiliateDetailsModal />
                <EditAffiliateData />
            </div>
        );
}

export default AffiliatesView;
