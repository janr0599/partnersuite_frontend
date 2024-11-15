import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useauth";

const ManagerLayout = () => {
    const { data: user, isLoading, isError } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== "manager") {
        return <Navigate to="/tickets" />;
    }

    if (isError) {
        return <Navigate to="/404" />;
    }

    return <Outlet />;
};

export default ManagerLayout;
