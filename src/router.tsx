import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import DashboardView from "@/views/DashboardView";
import TicketsView from "./views/TicketsView";
import TopUpRequestsView from "./views/TopUpRequestsView";
import AffiliatesView from "./views/AffiliatesView";
import FAQsView from "./views/FAQsView";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView />} index />
                    <Route path="/tickets" element={<TicketsView />} />
                    <Route
                        path="/top-up-requests"
                        element={<TopUpRequestsView />}
                    />
                    <Route path="/affiliates" element={<AffiliatesView />} />
                    <Route path="/faqs" element={<FAQsView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
