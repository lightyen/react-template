import { SwitchLanguage } from "@concepts/SwitchLanguage"
import { SwitchPrimaryColor } from "@concepts/SwitchPrimaryColor"
import { SwitchTheme } from "@concepts/SwitchTheme"
import { CustomColorPicker } from "~/concepts/CustomColorPicker"
import { CommandMenu } from "./CommandMenu"
import { NavigationSheetMenu } from "./NavigationMenu"

export function HeaderMenu() {
	return (
		<header
			tw="sticky top-0 w-full border-b bg-card [z-index: 15]
					backdrop-blur-lg supports-[backdrop-filter]:bg-card/90"
		>
			<div tw="px-2 sm:container flex gap-1 h-14 items-center">
				<NavigationSheetMenu />
				<div tw="ml-auto flex items-center">
					<div tw="mr-1">
						<CommandMenu />
					</div>
					<SwitchPrimaryColor />
					<SwitchLanguage />
					<CustomColorPicker />
					<SwitchTheme />
				</div>
			</div>
		</header>
	)
}
