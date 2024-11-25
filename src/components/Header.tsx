import { FiUser, FiBell, FiAlignJustify } from "react-icons/fi";

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    return (
        <header className="sticky top-0 z-[998] flex w-full bg-white">
            <div className="flex flex-grow items-center justify-between px-4 py-2 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-[99999] block rounded-sm border e bg-white p-1.5 shadow-sm"
                    >
                        <FiAlignJustify className="relative block h-5.5 w-5.5 cursor-pointer" />
                    </button>
                    <h1 className="">PartnerSuite</h1>
                </div>
                <div className="hidden lg:block">Partnersuite</div>
                <div className="flex items-center gap-8 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        <FiBell className="h-12 text-xl cursor-pointer hover:opacity-50 transition-opacity" />
                    </ul>
                    <FiUser className="h-12 text-xl mr-4 cursor-pointer hover:opacity-50 transition-opacity" />
                </div>
            </div>
        </header>
    );
};

export default Header;
