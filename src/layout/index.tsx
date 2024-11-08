import { Outlet } from "react-router-dom"
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
			<main tw="md:(grid grid-cols-[256px minmax(0, 1fr)]) lg:gap-10">
				<LeftNavigationMenu />
				<section tw="px-4 sm:container pt-7">
					<Outlet />
				</section>
			</main>
			<Toaster />
		</div>
	)
}
