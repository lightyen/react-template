import { Outlet } from "react-router"
import { Toaster } from "~/components/toast"
import { HeaderMenu } from "./HeaderMenu"
import { LeftNavigationMenu } from "./NavigationMenu"

export function Layout() {
	// if (auth !== "success") {
	// 	return <Navigate to="/login" />
	// }
	return <Root />
}

function Root() {
	return (
		<div id="app-view" tw="animate-enter min-h-screen">
			<HeaderMenu />
			<main tw="grid md:(grid-cols-[256px minmax(0, 1fr)]) gap-10">
				<LeftNavigationMenu />
				<section tw="sm:container">
					<Outlet />
				</section>
			</main>
			<Toaster />
		</div>
	)
}
