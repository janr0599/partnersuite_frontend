import {
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { IconType } from "react-icons";
import {
    FiArrowLeft,
    FiBookOpen,
    FiChevronsRight,
    FiDollarSign,
    FiHome,
    FiTag,
    FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticatedUser } from "@/types/authTypes";
import { isManager } from "@/utils/policies";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/api/ticketsAPI";
import { Tickets } from "@/types/ticketsTypes";
import { getTopUpRequests } from "@/api/topUpRequestsAPI";
import { TopUpRequests } from "@/types/topUpRequestsTypes";

type SideBarMenuProps = {
    user: AuthenticatedUser;
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
};

function SidebarMenu({ user, sidebarOpen, setSidebarOpen }: SideBarMenuProps) {
    const location = useLocation();

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    const dynamicSelected = location.pathname.split("/")[1];

    const defaultSelected = (): string => {
        if (dynamicSelected === "tickets") {
            return "Tickets";
        } else if (dynamicSelected === "") {
            return "Dashboard";
        } else if (dynamicSelected === "top-up-requests") {
            return "Top-up Requests";
        } else if (dynamicSelected === "affiliates") {
            return "Affiliates";
        } else if (dynamicSelected === "faqs") {
            return "FAQs";
        }
        return "Dashboard";
    };

    const { data } = useQuery<Tickets>({
        queryKey: ["tickets"],
        queryFn: () => getTickets(),
        retry: false,
    });

    const { data: topupRequests } = useQuery<TopUpRequests>({
        queryKey: ["topUpRequests"],
        queryFn: () => getTopUpRequests(),
        retry: false,
    });

    const pendingTopupRequests = useMemo(
        () =>
            topupRequests?.filter(
                (topUpRequest) => topUpRequest.status === "Pending"
            ),
        [topupRequests]
    );

    const openTickets = useMemo(
        () => data?.filter((ticket) => ticket.status === "open"),
        [data]
    );

    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState(defaultSelected);

    return (
        <aside
            className={`absolute left-0 top-0 z-[999] flex h-screen flex-col overflow-y-hidden bg-white duration-300 ease-linear lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <motion.nav
                layout
                className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2 shadow-xl"
                style={{
                    width: open ? "225px" : "fit-content",
                }}
            >
                <TitleSection
                    open={open}
                    user={user}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    trigger={trigger}
                />

                <div className="space-y-1">
                    {isManager(user) && (
                        <Option
                            Icon={FiHome}
                            title="Dashboard"
                            route="/"
                            selected={selected}
                            setSelected={setSelected}
                            open={open}
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                    )}

                    <Option
                        Icon={FiTag}
                        title="Tickets"
                        route="/tickets"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                        notifs={openTickets?.length}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    <Option
                        Icon={FiDollarSign}
                        title="Top-up Requests"
                        route="/top-up-requests"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                        notifs={pendingTopupRequests?.length}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    {isManager(user) && (
                        <Option
                            Icon={FiUsers}
                            title="Affiliates"
                            route="/affiliates"
                            selected={selected}
                            setSelected={setSelected}
                            open={open}
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                    )}

                    <Option
                        Icon={FiBookOpen}
                        title="FAQs"
                        route="/faqs"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                </div>

                <ToggleClose open={open} setOpen={setOpen} />
            </motion.nav>
        </aside>
    );
}

export default SidebarMenu;

const Option = ({
    Icon,
    title,
    route,
    selected,
    setSelected,
    open,
    notifs,
    sidebarOpen,
    setSidebarOpen,
}: {
    Icon: IconType;
    title: string;
    route: string;
    selected: string;
    setSelected: Dispatch<SetStateAction<string>>;
    open: boolean;
    notifs?: number;
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}) => {
    const navigate = useNavigate();
    return (
        <motion.button
            layout
            onClick={() => {
                setSelected(title);
                navigate(route);
                setSidebarOpen(!sidebarOpen);
            }}
            className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
                selected === title
                    ? "bg-slate-200 text-black"
                    : "text-slate-500 hover:bg-slate-200"
            }`}
        >
            <motion.div
                layout
                className="grid h-full w-10 place-content-center text-md"
            >
                <Icon />
            </motion.div>
            {open && (
                <motion.span
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.125 }}
                    className="text-sm font-medium"
                >
                    {title}
                </motion.span>
            )}

            {notifs! > 0 && open && (
                <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    style={{ y: "-50%" }}
                    transition={{ delay: 0.5 }}
                    className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
                >
                    {notifs}
                </motion.span>
            )}
        </motion.button>
    );
};

const TitleSection = ({
    open,
    user,
    sidebarOpen,
    setSidebarOpen,
    trigger,
}: {
    open: boolean;
    user: AuthenticatedUser;
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    trigger: React.MutableRefObject<any>;
}) => {
    return (
        <div className="mb-3 border-b border-slate-300 pb-4">
            <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-3 w-full">
                    <Logo />
                    {open && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.125 }}
                        >
                            <span className="block text-sm font-semibold">
                                {user.name}
                            </span>
                            <span className="block text-xs font text-slate-500">
                                {user.role}
                            </span>
                        </motion.div>
                    )}
                    <button
                        ref={trigger}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-controls="sidebar"
                        aria-expanded={sidebarOpen}
                        className="block cursor-auto lg:hidden ml-auto text-2xl text-slate-500"
                    >
                        <FiArrowLeft />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Logo = () => {
    // Temp logo from https://logoipsum.com/
    return (
        <motion.div
            layout
            className="grid size-10 shrink-0 place-content-center rounded-md"
        >
            <img
                src="/Partner_Suite_Logo_Text.svg"
                alt="PartnerSuite Logo"
                className="w-full"
            />
        </motion.div>
    );
};

const ToggleClose = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <motion.button
            layout
            onClick={() => setOpen((pv) => !pv)}
            className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100 hidden lg:block"
        >
            <div className="flex items-center p-2">
                <motion.div
                    layout
                    className="grid size-10 place-content-center text-lg"
                >
                    <FiChevronsRight
                        className={`transition-transform ${
                            open && "rotate-180"
                        }`}
                    />
                </motion.div>
                {open && (
                    <motion.span
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.125 }}
                        className="text-xs font-medium"
                    >
                        Hide
                    </motion.span>
                )}
            </div>
        </motion.button>
    );
};
