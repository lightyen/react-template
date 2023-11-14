import { SwitchLanguage } from "@concepts/SwitchLanguage"
import { SwitchPrimaryColor } from "@concepts/SwitchPrimaryColor"
import { SwitchTheme } from "@concepts/SwitchTheme"
import { CommandMenu } from "./CommandMenu"
import { NavigationSheetMenu } from "./NavigationMenu"

export function HeaderMenu() {
	return (
		<header
			tw="sticky top-0 z-50 w-full border-b bg-background/95
					backdrop-blur-lg supports-[backdrop-filter]:bg-background/70"
		>
			<div tw="px-2 sm:container flex gap-1 h-14 items-center">
				<NavigationSheetMenu />
				<div tw="ml-auto flex items-center">
					<div tw="mr-1">
						<CommandMenu />
					</div>
					<SwitchPrimaryColor />
					<SwitchLanguage />
					<SwitchTheme />
				</div>
			</div>
		</header>
	)
}
