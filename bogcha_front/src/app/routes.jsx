import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { CamerasPage } from "./components/CamerasPage";
import { EventsPage } from "./components/EventsPage";
import { ChildrenPage } from "./components/ChildrenPage";
import { StaffPage } from "./components/StaffPage";
import { ReportsPage } from "./components/ReportsPage";
import { SettingsPage } from "./components/SettingsPage";
export const router = createBrowserRouter([
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/",
        Component: MainLayout,
        children: [
            { index: true, Component: Dashboard },
            { path: "cameras", Component: CamerasPage },
            { path: "events", Component: EventsPage },
            { path: "children", Component: ChildrenPage },
            { path: "staff", Component: StaffPage },
            { path: "reports", Component: ReportsPage },
            { path: "settings", Component: SettingsPage },
        ],
    },
]);
