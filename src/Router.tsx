import { setScroll } from "@components/lib/scrollbar"
import { useEffect } from "react"
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { FormRoutes } from "~/pages/Form"
import { Layout } from "./layout"
import { ColorsRoutes } from "./pages/Colors"
import { ComponentRoutes } from "./pages/Component"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { NotFound } from "./pages/NotFound"
import { TableRoutes } from "./pages/Table"
import { TestRoutes } from "./pages/Test"

const root = "/"

function FullPage() {
	useEffect(() => {
		setScroll(false)
	}, [])
	return <Outlet />
}

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path={root}>
			<Route Component={FullPage}>
				<Route path="login" Component={Login} />
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
	{
		future: {
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_relativeSplatPath: true,
			v7_skipActionErrorRevalidation: true,
		},
	},
)
