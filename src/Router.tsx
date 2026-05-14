import { useEffect } from "react"
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router"
import { setScroll } from "~/components/internal/scrollbar"
import { FormRoutes } from "~/views/Form"
import { ErrorHandler } from "./ErrorHandler"
import { Layout } from "./layout"
import { ComponentRoutes } from "./views/Component"
import { Login } from "./views/Login"
import { TableRoutes } from "./views/Table"

function FullPage() {
	useEffect(() => {
		setScroll(false)
	}, [])
	return <Outlet />
}

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" errorElement={<ErrorHandler />} HydrateFallback={() => null}>
			<Route Component={FullPage}>
				<Route path="login" Component={Login} />
				<Route path="memtest" lazy={() => import("./views/Memtest")} />
			</Route>
			<Route Component={Layout}>
				<Route index lazy={() => import("./views/Home")} />
				<Route path="*" lazy={() => import("./views/NotFound")} />
				{ComponentRoutes}
				{FormRoutes}
				{TableRoutes}
				<Route path="colors" lazy={() => import("./views/Colors")} />
				<Route path="test" lazy={() => import("./views/Test")} />
			</Route>
		</Route>,
	),
)
