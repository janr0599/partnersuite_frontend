import { getUser } from "@/api/authAPI";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        retry: false,
        refetchOnWindowFocus: false,
    });

    return { data, isError, isLoading, refetch };
};
