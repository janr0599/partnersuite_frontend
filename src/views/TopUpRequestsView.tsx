import { createTopUpRequest, getTopUpRequests } from "@/api/topUpRequestsAPI";
import TopUpRequestsTable from "@/components/TopUpRequests/TopUpRequestsTable";
import { useAuth } from "@/hooks/useauth";
import { TopUpRequestsstatusTranslations } from "@/locales/en";
import { TopUpRequests } from "@/types/topUpRequestsTypes";
import { isManager } from "@/utils/policies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiDollarSign, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

function TopUpRequestsView() {
    const { data: user, isLoading: userLoading } = useAuth();
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
                <div className="flex flex-col items-start lg:flex-row md:items-center justify-between gap-6">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold mb-4 md:mb-0 mr-auto">
                        {isManager(user)
                            ? "Top-Up Requests Management"
                            : "Top-Up Requests"}
                    </h1>
                    {isManager(user) ? (
                        <div className="flex flex-col sm:flex-row gap-6 font-normal items-start md:items-center flex-1 w-full lg:max-w-md">
                            <div className="relative flex items-center flex-1 min-w-[250px] md:w-auto">
                                <FiSearch className="absolute left-3 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search Top Up Request..."
                                    className="w-full bg-white border border-slate-300 rounded-md pl-10 py-2 text-sm text-gray-500 outline-none"
                                />
                            </div>
                            <div className="md:w-1/2 min-w-36 ">
                                <select
                                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm text-gray-500 outline-none"
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
