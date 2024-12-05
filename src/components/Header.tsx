import { AuthenticatedUser } from "@/types/authTypes";
import { Notifications, Notification } from "@/types/notificationsTypes";
import {
    Popover,
    PopoverButton,
    PopoverPanel,
    CloseButton,
} from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiUser, FiBell, FiAlignJustify, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import TicketDetailsModal from "@/components/tickets/TicketDetailsModal";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { timeAgo } from "@/utils/utils";
import {
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/api/notificationsAPI";

type HeaderProps = {
    user: AuthenticatedUser;
    notifications: Notifications;
    isLoadingNotifications: boolean;
    isErrorNotifications: boolean;
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
};

const Header = ({
    user,
    sidebarOpen,
    setSidebarOpen,
    notifications,
    isLoadingNotifications,
    isErrorNotifications,
}: HeaderProps) => {
    const navigate = useNavigate();

    const unreadNotifications = useMemo(
        () =>
            notifications.filter(
                (notification) => notification.status === "unread"
            ).length,
        [notifications]
    );

    const queryClient = useQueryClient();
    const { mutate: markNotificationAsReadMutation } = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const handleNotificationClick = (
        notificationLink: Notification["link"],
        id: Notification["_id"],
        type: Notification["type"]
    ) => {
        if (type === "ticketComment") {
            navigate("tickets" + notificationLink);
        } else if (type === "topUpRequest") {
            navigate(notificationLink);
        }
        markNotificationAsReadMutation(id);
    };

    const { mutate: markAllNotificationsAsReadMutation, isPending } =
        useMutation({
            mutationFn: markAllNotificationsAsRead,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["notifications"] });
            },
        });

    const handleMarkAllNotificationsAsRead = () => {
        markAllNotificationsAsReadMutation();
    };

    const logout = () => {
        localStorage.removeItem("AUTH_TOKEN_PARTNERSUITE");
        queryClient.removeQueries({ queryKey: ["user"] });
        queryClient.removeQueries({ queryKey: ["tickets"] });
        navigate("/auth/login");
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
                    <p className="font-bold">PartnerSuite</p>
                </div>
                <p className="hidden lg:block font-bold">Partnersuite</p>
                <div className="flex items-center gap-8 2xsm:gap-7">
                    <Popover>
                        <PopoverButton className="block text-sm/6 font-semibold text-black focus:outline-none data-[active]:text-black data-[hover]:opacity-70 data-[focus]:outline-1 data-[focus]:outline-white transition-opacity">
                            <motion.div>
                                <FiBell className="relative h-12 text-xl cursor-pointer" />
                                {unreadNotifications > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        style={{ y: "-50%" }}
                                        transition={{ delay: 0.5 }}
                                        className="absolute right-22 top-1/3 size-4 rounded-full bg-indigo-500 text-xs text-white w-fit px-1"
                                    >
                                        {unreadNotifications}
                                    </motion.span>
                                )}
                            </motion.div>
                        </PopoverButton>
                        <PopoverPanel
                            transition
                            anchor="bottom"
                            className="divide-y divide-slate-300 rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0 z-[100000] shadow-xl -translate-x-5 border min-w-[200px] lg:min-w-[280px] p-2 max-w-20"
                        >
                            <div className="flex items-center justify-between p-2">
                                <h2 className="font-semibold">Notifications</h2>
                                <button
                                    className={`text-xs ${
                                        unreadNotifications === 0
                                            ? "opacity-50"
                                            : "hover:underline"
                                    }`}
                                    onClick={handleMarkAllNotificationsAsRead}
                                    disabled={unreadNotifications === 0}
                                >
                                    {isPending
                                        ? "Processing..."
                                        : "Mark all as read"}
                                </button>
                            </div>
                            <div className="p-2">
                                {notifications.length > 0 ? (
                                    <div className="flex flex-col gap-2 max-w-64 md:max-w-80 max-h-64 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification._id}
                                                className={`flex flex-row items-center gap-2 p-2 rounded-lg mr-2 border-b border-slate-200 hover:bg-slate-200 transition-colors ${
                                                    notification.status ===
                                                    "read"
                                                        ? ""
                                                        : "bg-slate-200"
                                                }`}
                                            >
                                                {isLoadingNotifications && (
                                                    <p className="text-sm font-semibold">
                                                        Loading...
                                                    </p>
                                                )}
                                                {isErrorNotifications && (
                                                    <p className="text-sm font-semibold">
                                                        Error loading
                                                        notifications
                                                    </p>
                                                )}
                                                <p
                                                    className={`text-sm ${
                                                        notification.status ===
                                                        "read"
                                                            ? ""
                                                            : "font-semibold"
                                                    }`}
                                                >
                                                    {notification.message}
                                                </p>
                                                <div>
                                                    <p className="text-[11px] text-slate-600">
                                                        {timeAgo(
                                                            notification.createdAt
                                                        )}
                                                    </p>
                                                    <PopoverButton
                                                        className={`hover:underline rounded-md p-2 text-sm transition-colors ${
                                                            notification.status ===
                                                            "read"
                                                                ? ""
                                                                : "font-medium"
                                                        }`}
                                                        onClick={() =>
                                                            handleNotificationClick(
                                                                notification.link,
                                                                notification._id,
                                                                notification.type
                                                            )
                                                        }
                                                    >
                                                        view
                                                    </PopoverButton>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No Notifications</p>
                                )}
                            </div>
                        </PopoverPanel>
                    </Popover>
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
            <TicketDetailsModal />
        </header>
    );
};
export default Header;
