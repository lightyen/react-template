import { setScroll } from "@components/lib/scrollbar"
import { useEffect } from "react"
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Layout } from "./layout"
import { ComponentPage, ComponentRoutes } from "./pages/CompoentPage"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { NotFound } from "./pages/NotFound"
import { Table } from "./pages/Table"
import { Test } from "./pages/Test"

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
				<Route path="components" Component={ComponentPage} />
				<Route path="table" Component={Table} />
				<Route path="test" Component={Test} />
				{ComponentRoutes}
			</Route>
		</Route>,
	),
)
