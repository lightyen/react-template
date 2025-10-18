import { useEffect } from "react"
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router"
import { setScroll } from "~/components/internal/scrollbar"
import { FormRoutes } from "~/views/Form"
import { ErrorHandler } from "./ErrorHandler"
import { Layout } from "./layout"
import { ColorsRoutes } from "./views/Colors"
import { ComponentRoutes } from "./views/Component"
import { Home } from "./views/Home"
import { Login } from "./views/Login"
import { MemoryLeakTest } from "./views/Memtest"
import { NotFound } from "./views/NotFound"
import { TableRoutes } from "./views/Table"
import { TestRoutes } from "./views/Test"

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
				<Route path="memtest" Component={MemoryLeakTest} />
			</Route>
			<Route Component={Layout}>
				<Route index Component={Home} />
				<Route path="*" Component={NotFound} />
				{ComponentRoutes}
				{FormRoutes}
				{TableRoutes}
				{ColorsRoutes}
				{TestRoutes}
			</Route>
		</Route>,
	),
)
