import SidebarMenu from "@/components/SideBarMenu";
import { Navigate, Outlet } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useauth";

function AppLayout() {
    const { data: user, isError, isLoading } = useAuth();

    if (isLoading) return "Loading...";

    if (isError) {
        return <Navigate to={"/auth/login"} />;
    }

    if (user) console.log(user);
    return (
        <>
            <div className="flex">
                <aside>
                    <SidebarMenu user={user!} />
                </aside>
                <div className="grid grid-rows-[auto_1fr] w-full bg-slate-100">
                    <header className="p-2 border-b border-slate-300 h-[60px] mx-2">
                        <div className="flex items-center justify-between">
                            <h1 className="">PartnerSuite</h1>
                            <FiUser className="h-12 text-xl mr-4" />
                        </div>
                    </header>
                    <main className="p-4">
                        <Outlet />
                    </main>
                </div>
            </div>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </>
    );
}

export default AppLayout;
