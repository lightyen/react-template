import { useEffect } from "react"
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router"
import { setScroll } from "~/components/internal/scrollbar"
import { FormRoutes } from "~/pages/Form"
import { ErrorHandler } from "./ErrorHandler"
import { Layout } from "./layout"
import { ColorsRoutes } from "./pages/Colors"
import { ComponentRoutes } from "./pages/Component"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { MemoryLeakTest } from "./pages/Memtest"
import { NotFound } from "./pages/NotFound"
import { TableRoutes } from "./pages/Table"
import { TestRoutes } from "./pages/Test"

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
