import { Dispatch, SetStateAction, useState } from "react";
import { IconType } from "react-icons";
import {
    FiBookOpen,
    FiChevronsRight,
    FiDollarSign,
    FiHome,
    FiTag,
    FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthenticatedUser } from "@/types/authTypes";
import { isManager } from "@/utils/policies";

type SideBarMenuProps = {
    user: AuthenticatedUser;
};

function SidebarMenu({ user }: SideBarMenuProps) {
    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <motion.nav
            layout
            className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2 shadow-xl"
            style={{
                width: open ? "225px" : "fit-content",
            }}
        >
            <TitleSection open={open} />

            <div className="space-y-1">
                {isManager(user) && (
                    <Option
                        Icon={FiHome}
                        title="Dashboard"
                        route="/"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                )}

                <Option
                    Icon={FiTag}
                    title="Tickets"
                    route="/tickets"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                    notifs={3}
                />

                <Option
                    Icon={FiDollarSign}
                    title="Top-up Requests"
                    route="/top-up-requests"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />

                {isManager(user) && (
                    <Option
                        Icon={FiUsers}
                        title="Affiliates"
                        route="/affiliates"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                )}

                <Option
                    Icon={FiBookOpen}
                    title="FAQs"
                    route="/faqs"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
            </div>

            <ToggleClose open={open} setOpen={setOpen} />
        </motion.nav>
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
}: {
    Icon: IconType;
    title: string;
    route: string;
    selected: string;
    setSelected: Dispatch<SetStateAction<string>>;
    open: boolean;
    notifs?: number;
}) => {
    const navigate = useNavigate();
    return (
        <motion.button
            layout
            onClick={() => {
                setSelected(title);
                navigate(route);
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

            {notifs && open && (
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

const TitleSection = ({ open }: { open: boolean }) => {
    return (
        <div className="mb-3 border-b border-slate-300 pb-3">
            <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
                <div className="flex items-center gap-2">
                    <Logo />
                    {open && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.125 }}
                        >
                            <span className="block text-xs font-semibold">
                                Thomas
                            </span>
                            <span className="block text-xs text-slate-500">
                                Manager
                            </span>
                        </motion.div>
                    )}
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
            className="grid size-10 shrink-0 place-content-center rounded-md bg-black"
        >
            <svg
                width="24"
                height="auto"
                viewBox="0 0 50 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-slate-50"
            >
                <path
                    d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
                    stopColor="#000000"
                ></path>
                <path
                    d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
                    stopColor="#000000"
                ></path>
            </svg>
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
            className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
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
