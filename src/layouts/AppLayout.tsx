import SidebarMenu from "@/components/SideBarMenu";
import { Outlet } from "react-router-dom";
import { FiUser } from "react-icons/fi";

function AppLayout() {
    return (
        <>
            <div className="flex">
                <aside>
                    <SidebarMenu />
                </aside>
                <div className="grid grid-rows-[auto_1fr] w-full">
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
        </>
    );
}

export default AppLayout;
