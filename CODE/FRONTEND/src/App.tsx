import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { NavbarWarhouseman } from "./components/navbar-warehouseman";
import { NavbarPrinter } from "./components/navbar-printer";
import { Home } from "./views/home";
import { SignIn } from "./views/sign-in";
import { AdminPanel } from "./views/admin-panel/admin-users";
import { AdminRole } from "./views/admin-panel/admin-roles";
import { AdminWarehouse } from "./views/admin-panel/admin-warehouse";
import "./scss/index.scss";
import ScrollToTop from "./hooks/scroll-to-top";
import SignUp from "./views/sign-up-main/sign-up-main";
import { AdminTask } from "./views/admin-panel/admin-tasks";
import { Admindashboard } from "./views/admin-panel/admin-dashboard";
import { Layout } from "antd";
import { WarehousmenWarehouse } from "./views/warehouseman-panel/warehouseman-warhouses";
import { WarehousemanTasks } from "./views/warehouseman-panel/warehouseman-tasks";
import { PrinterProducts } from "./views/printer-panel/printer-items";
import { PrinterTask } from "./views/printer-panel/printer-tasks";
import AdminProducts from "./views/admin-panel/admin-products/admin-products";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataProvider, ROLES } from "./context/data-context";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Logout from "./components/auth/Logout";
import { UserDashboard } from "./views/user-dashboard";
import SettingsPanel from "./views/settings-panel/settings-panel";
import UserTasks from "./views/admin-panel/admin-user-tasks/admin-user-tasks";
import UserRoleUsers from "./views/admin-panel/user-with-no-roles/user-with-no-roles";
import { ManagerTasks } from "./views/manager-panel/manager-tasks/manager-tasks";
import { NavbarManager } from "./components/navbar-manager";
import WaitingPanel from "./views/waiting-panel/waiting-panel";
import AdminFinishedTasks from "./views/admin-panel/admin-finished-tasks/admin-finished-tasks"
import MenagerFinishedTasks from "./views/manager-panel/manager-finishe-tasks/manager-finishe-tasks";

const { Content } = Layout;

export const Layout1 = () => {
	return (
		<ScrollToTop>
			<Layout style={{ minHeight: "100vh" }}>
				<Navbar />
				<Layout>
					<Content style={{ margin: "0 10px" }}>
						<Outlet />
					</Content>
				</Layout>
				{/* <Footer /> */}
			</Layout>
		</ScrollToTop>
	);
};

export const Layout2 = () => {
	return (
		<ScrollToTop>
			<Layout style={{ minHeight: "100vh" }}>
				<NavbarWarhouseman />
				<Layout>
					<Content style={{ margin: "0 10px" }}>
						<Outlet />
					</Content>
				</Layout>
				{/* <Footer /> */}
			</Layout>
		</ScrollToTop>
	);
};

export const Layout3 = () => {
	return (
		<ScrollToTop>
			<Layout style={{ minHeight: "100vh" }}>
				<NavbarPrinter />
				<Layout>
					<Content style={{ margin: "0 10px" }}>
						<Outlet />
					</Content>
				</Layout>
				{/* <Footer /> */}
			</Layout>
		</ScrollToTop>
	);
};

export const Layout4 = () => {
	return (
		<ScrollToTop>
			<Layout style={{ minHeight: "100vh" }}>
				<NavbarManager />
				<Layout>
					<Content style={{ margin: "0 10px" }}>
						<Outlet />
					</Content>
				</Layout>
				{/* <Footer /> */}
			</Layout>
		</ScrollToTop>
	);
};

const router = createHashRouter([
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<Layout1 />
			</ProtectedRoute>
		),
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/roles",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
						<AdminRole />
					</ProtectedRoute>
				),
			},
			{
				path: "/warehouses",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<AdminWarehouse />
					</ProtectedRoute>
				),
			},
			{
				path: "/products",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<AdminProducts />
					</ProtectedRoute>
				),
			},
			{
				path: "/tasks",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<AdminTask />
					</ProtectedRoute>
				),
			},
			{
				path: "/home",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<Admindashboard />
					</ProtectedRoute>
				),
			},
			{
				path: "/users",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<AdminPanel />
					</ProtectedRoute>
				),
			},
			{
				path: "/settings",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<SettingsPanel />
					</ProtectedRoute>
				),
			},
			{
				path: "/tasks/user/:id",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<UserTasks />
					</ProtectedRoute>
				)
			},
			{
				path: "/users-with-role-user",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<UserRoleUsers />
					</ProtectedRoute>
				)
			},
			{
				path: "/finnished-tasks",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
						<AdminFinishedTasks />
					</ProtectedRoute>
				)
			}
		],
	},
	{
		path: "/login",
		element: <SignIn />,
	},
	{
		path: "/logout",
		element: <Logout />,
	},
	{
		path: "/register",
		element: <SignUp />,
	},
	{
		path: "/waiting",
		element: (
			<ProtectedRoute requiredRoles={[ROLES.USER]}>
				<WaitingPanel />
			</ProtectedRoute>
		)
	},

	{
		path: "/warehouseman",
		element: (
			<ProtectedRoute>
				<Layout2 />
			</ProtectedRoute>
		),
		children: [
			{
				path: "/warehouseman/home",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.WAREHOUSEMAN]}>
						<UserDashboard />
					</ProtectedRoute>
				)
			},
			{
				path: "/warehouseman/warehouses",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.WAREHOUSEMAN]}>
						<WarehousmenWarehouse />
					</ProtectedRoute>
				)
			},
			{
				path: "/warehouseman/tasks",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.WAREHOUSEMAN]}>
						<WarehousemanTasks />
					</ProtectedRoute>
				)
			},
			{
				path: "/warehouseman/settings",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.WAREHOUSEMAN]}>
						<SettingsPanel />
					</ProtectedRoute>
				),
			},
		],
	},
	{
		path: "/printer",
		element: (
			<ProtectedRoute>
				<Layout3 />
			</ProtectedRoute>
		),
		children: [
			{
				path: "/printer/home",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.PRINTER]}>
						<UserDashboard />
					</ProtectedRoute>
				)
			},
			{
				path: "/printer/products",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.PRINTER]}>
						<PrinterProducts />
					</ProtectedRoute>
				)
			},
			{
				path: "/printer/tasks",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.PRINTER]}>
						<PrinterTask />
					</ProtectedRoute>
				)
			},
			{
				path: "/printer/settings",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.PRINTER]}>
						<SettingsPanel />
					</ProtectedRoute>
				),
			},
		]
	},

	{
		path: "/manager",
		element: (
			<ProtectedRoute>
				<Layout4 />
			</ProtectedRoute>
		),
		children: [
			{
				path: "/manager/home",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.MANAGER]}>
						<UserDashboard />
					</ProtectedRoute>
				)
			},
			{
				path: "/manager/tasks",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.MANAGER]}>
						<ManagerTasks />
					</ProtectedRoute>
				)
			},
			{
				path: "/manager/settings",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.MANAGER]}>
						<SettingsPanel />
					</ProtectedRoute>
				),
			},
			{
				path: "/manager/finnished-tasks",
				element: (
					<ProtectedRoute requiredRoles={[ROLES.MANAGER]}>
						<MenagerFinishedTasks />
					</ProtectedRoute>
				)
			}
		]
	},
]);

function App() {
	return (
		<DataProvider>
			<div className="App">
				<RouterProvider router={router} />
				<ToastContainer autoClose={3000} position="top-center" />
			</div>
		</DataProvider>
	);
}

export default App;
