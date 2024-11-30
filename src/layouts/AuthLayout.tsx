// import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function AuthLayout() {
    return (
        <>
            <div className="bg-auth-background min-h-screen">
                <div className="w-[400px] py-8 mx-auto md:w-[550px]">
                    {/* <Logo /> */}
                    <div className="">
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </>
    );
}

export default AuthLayout;
