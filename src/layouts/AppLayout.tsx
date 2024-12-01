import SidebarMenu from "@/components/SideBarMenu";
import { Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useauth";
import Header from "@/components/Header";
import { useState } from "react";

function AppLayout() {
    const { data: user, isError, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isLoading) return "Loading...";

    if (isError) {
        return <Navigate to={"/auth/login"} />;
    }

    if (user)
        return (
            <>
                <div className="bg-slate-100">
                    <div className="flex h-screen overflow-hidden">
                        <SidebarMenu
                            user={user}
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                            <Header
                                user={user}
                                sidebarOpen={sidebarOpen}
                                setSidebarOpen={setSidebarOpen}
                            />
                            <main>
                                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                                    <Outlet />
                                </div>
                            </main>
                        </div>
                    </div>
                </div>

                <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
            </>
        );
}

export default AppLayout;
