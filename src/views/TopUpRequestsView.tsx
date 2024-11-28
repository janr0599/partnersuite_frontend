import { createTopUpRequest, getTopUpRequests } from "@/api/topUpRequestsAPI";
import TopUpRequestsTable from "@/components/TopUpRequests/TopUpRequestsTable";
import { useAuth } from "@/hooks/useauth";
import { TopUpRequests } from "@/types/topUpRequestsTypes";
import { isManager } from "@/utils/policies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiDollarSign } from "react-icons/fi";
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
            <div className="shadow-xl rounded-lg bg-white p-6 md:px-10">
                <div className="flex flex-col items-start sm:flex-row md:items-center justify-between">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold mb-4 md:mb-0 mr-auto">
                        {isManager(user)
                            ? "Top-Up Requests Management"
                            : "Top-Up Requests"}
                    </h1>
                    {!isManager(user) && (
                        <button
                            className="bg-white hover:bg-slate-100 text-black text-xs md:text-base px-4 py-2 border border-slate-500 rounded-md inline-flex items-center gap-2 transition-colors font-bold"
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
