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

    const queryClient = useQueryClient();
    const { mutate: mutateCreateTopUpRequest } = useMutation({
        mutationFn: createTopUpRequest,
        onError: (error: any) => {
            const errorMessage =
                error.message || "An unexpected error occurred";
            toast.error(errorMessage);
            console.log(errorMessage);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryClient.invalidateQueries({ queryKey: ["topUpRequests"] });
        },
    });

    const handleCreateTopUpRequest = () => {
        mutateCreateTopUpRequest();
    };

    if (isLoading && userLoading) return "Loading...";

    if (data && user)
        return (
            <div className="shadow-xl rounded-lg bg-white p-6 md:px-10">
                <div className="flex flex-col items-start sm:flex-row justify-between">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold mb-4 md:mb-0 mr-auto">
                        {isManager(user)
                            ? "Top-Up Requests Management"
                            : "Top-Up Requests"}
                    </h1>
                    {!isManager(user) && (
                        <div className="flex flex-col gap-2">
                            <button
                                className="bg-white hover:bg-slate-100 text-black text-xs md:text-base px-4 py-2 border border-slate-500 rounded-md inline-flex items-center gap-2 transition-colors font-bold w-fit sm:ml-auto"
                                onClick={handleCreateTopUpRequest}
                            >
                                <FiDollarSign className="text-xl" />
                                Request Bonus Top-up
                            </button>
                            <p className="text-xs text-slate-500 mt-2">
                                Requests made after 3 PM French Time (UTC +1)
                                will be proceessed the next day
                            </p>
                        </div>
                    )}
                </div>
                {data.length > 0 ? (
                    <TopUpRequestsTable
                        topUpRequests={data}
                        isLoading={isLoading}
                        user={user}
                    />
                ) : (
                    <div className="flex flex-col space-y-5 text-center mt-10">
                        <img
                            src="/no-requests.svg"
                            className="size-28 md:size-44 mx-auto"
                            alt="No tickets"
                        />
                        <h2 className="text-base md:text-xl font-bold text-slate-400">
                            Top-up requests will show up here.
                        </h2>
                    </div>
                )}
            </div>
        );
}

export default TopUpRequestsView;
