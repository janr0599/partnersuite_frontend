import { AuthenticatedUser } from "@/types/authTypes";
import {
    Popover,
    PopoverButton,
    PopoverPanel,
    CloseButton,
} from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FiUser, FiBell, FiAlignJustify, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

type HeaderProps = {
    user: AuthenticatedUser;
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
};

const Header = ({ user, sidebarOpen, setSidebarOpen }: HeaderProps) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("AUTH_TOKEN_PARTNERSUITE");
        queryClient.removeQueries({ queryKey: ["user"] });
        queryClient.removeQueries({ queryKey: ["tickets"] });
        if (user.role === "affiliate") {
            navigate("/auth/login-affiliate");
        } else if (user.role === "manager") {
            navigate("/auth/login");
        }
    };

    return (
        <header className="sticky top-0 z-[998] flex w-full bg-white shadow-lg">
            <div className="flex flex-grow items-center justify-between px-4 py-2 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(!sidebarOpen);
                        }}
                        className="z-[99999] block rounded-sm border e bg-white p-1.5 shadow-sm"
                    >
                        <FiAlignJustify className="relative block h-5.5 w-5.5 cursor-pointer" />
                    </button>
                    <p>PartnerSuite</p>
                </div>
                <p className="hidden lg:block">Partnersuite</p>
                <div className="flex items-center gap-8 2xsm:gap-7">
                    <ul className="flex items-center gap-2 sm:gap-4">
                        <FiBell className="h-12 text-xl cursor-pointer hover:opacity-50 transition-opacity" />
                    </ul>
                    <Popover>
                        <PopoverButton className="block text-sm/6 font-semibold text-black focus:outline-none data-[active]:text-black data-[hover]:opacity-70 data-[focus]:outline-1 data-[focus]:outline-white transition-opacity">
                            <FiUser className="h-12 text-xl mr-4 cursor-pointer" />
                        </PopoverButton>
                        <PopoverPanel
                            transition
                            anchor="bottom"
                            className="divide-y divide-slate-300 rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0 z-[100000] shadow-xl -translate-x-5 border min-w-[200px] lg:min-w-[280px] p-2"
                        >
                            <div className="p-2">
                                <CloseButton
                                    as={Link}
                                    to="/profile"
                                    className="block rounded-lg py-2 px-3 transition hover:bg-slate-200"
                                >
                                    <p className="font-semibold text-black">
                                        Profile
                                    </p>
                                    <p className="text-black/50 text-xs md_text-sm">
                                        Manage your profile and password
                                    </p>
                                </CloseButton>
                            </div>
                            <div className="p-2 h-fit">
                                <button
                                    className="flex items-center justify-between rounded-lg py-2 px-3 transition hover:bg-slate-200 group w-full text-left"
                                    onClick={logout}
                                >
                                    <p className="font-semibold text-black">
                                        Log out
                                    </p>
                                    <FiLogOut className="text-black group-hover:text-red-500 transition-all group-hover:translate-x-0.5" />
                                </button>
                            </div>
                        </PopoverPanel>
                    </Popover>
                </div>
            </div>
        </header>
    );
};
export default Header;
