import Tabs from "@/components/profile/Tabs";
import { Outlet } from "react-router-dom";

function ProfileLayout() {
    return (
        <div className="">
            <Tabs />
            <Outlet />
        </div>
    );
}

export default ProfileLayout;
