import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import ManagerDashboardView from "@/views/ManagerDashboardView";
import TicketsView from "./views/TicketsView";
import TopUpRequestsView from "./views/TopUpRequestsView";
import AffiliatesView from "./views/AffiliatesView";
import FAQsView from "./views/FAQsView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegistrationView from "./views/auth/RegistrationView";
import ManagerLayout from "./layouts/ManagerLayout";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route element={<ManagerLayout />}>
                        <Route
                            path="/"
                            element={<ManagerDashboardView />}
                            index
                        />

                        <Route
                            path="/affiliates"
                            element={<AffiliatesView />}
                        />
                    </Route>
                    <Route path="/tickets" element={<TicketsView />} />
                    <Route
                        path="/top-up-requests"
                        element={<TopUpRequestsView />}
                    />
                    <Route path="/faqs" element={<FAQsView />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/auth/login" element={<LoginView />} />
                    <Route
                        path="/auth/registration"
                        element={<RegistrationView />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
