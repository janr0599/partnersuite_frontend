import { createTopUpRequest, getTopUpRequests } from "@/api/topUpRequestsAPI";
import TopUpRequestsTable from "@/components/TopUpRequests/TopUpRequestsTable";
import { useAuth } from "@/hooks/useauth";
import { TopUpRequestsstatusTranslations } from "@/locales/en";
import { TopUpRequests } from "@/types/topUpRequestsTypes";
import { isManager } from "@/utils/policies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiDollarSign, FiSearch } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function TopUpRequestsView() {
    const { data: user, isLoading: userLoading } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery<TopUpRequests>({
        queryKey: ["topUpRequests"],
        queryFn: () => getTopUpRequests(),
        retry: false,
    });

    const queryclient = useQueryClient();
    const { mutate: mutateCreateTopUpRequest } = useMutation({
        mutationFn: createTopUpRequest,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryclient.invalidateQueries({
                queryKey: ["topUpRequests"],
            });
        },
    });

    const handleCreateTopUpRequest = () => {
        mutateCreateTopUpRequest();
    };

    if (isLoading && userLoading) return "Loading...";

    if (data && user)
        return (
            <div className="shadow-xl rounded-lg bg-white p-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">
                        {isManager(user)
                            ? "Top-Up Requests Management"
                            : "Top-Up Requests"}
                    </h1>
                    {isManager(user) ? (
                        <div className="flex gap-6 font-semibold">
                            <div className="inline-flex gap-2 items-center">
                                <FiSearch className="text-gray-500" />

                                <input
                                    type="text"
                                    placeholder="Search top-up requests..."
                                    className="bg-ehite p-2 rounded-md border border-slate-300 outline-none text-gray-500 text-sm"
                                />
                            </div>

                            <select
                                className="w-1/2 p-2 bg-white border border-slate-300 rounded-lg text-sm text-gray-500 outline-none"
                                onChange={() => {}}
                            >
                                <option value="all">All Statuses</option>
                                {Object.entries(
                                    TopUpRequestsstatusTranslations
                                ).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <button
                            className="bg-white hover:bg-slate-100 text-black px-4 py-2 border border-slate-500 rounded-md inline-flex items-center gap-2 transition-colors font-bold"
                            onClick={handleCreateTopUpRequest}
                        >
                            <FiDollarSign className="text-xl" />
                            Request Bonus Top-up
                        </button>
                    )}
                </div>
                {data.length === 0 ? (
                    <div className="text-lg mt-10 text-slate-500">
                        Top Up Requests will show up here
                    </div>
                ) : (
                    // <TicketsTable topUpRequests={data} isLoading={isLoading} />
                    <TopUpRequestsTable
                        topUpRequests={data}
                        isLoading={isLoading}
                        user={user}
                    />
                )}
            </div>
        );
}

export default TopUpRequestsView;
