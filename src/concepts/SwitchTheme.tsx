import { Half2Icon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { Button } from "~/components/button"
import { Command, CommandItem, CommandList } from "~/components/command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "~/components/popover"
import { setTheme } from "./theme"

export function SwitchTheme() {
	type ThemeStyle = "system" | "light" | "dark"
	const [themeStyle, setStyle] = useState<ThemeStyle>(() => {
		return (localStorage.getItem("theme.style") as ThemeStyle) ?? "system"
	})
	return (
		<Popover placement="bottom-end">
			<PopoverTrigger>
				<Button type="button" aria-label="Switch Theme" variant="ghost" size="icon" tw="rounded-none">
					{(() => {
						switch (themeStyle) {
							case "light":
								return <SunIcon />
							case "dark":
								return <MoonIcon />
							default:
								return <Half2Icon />
						}
					})()}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command tw="w-28 p-1">
					<PopoverClose>
						<CommandList>
							<CommandItem value="-" tw="hidden" />
							<CommandItem
								onSelect={() => {
									localStorage.removeItem("theme.style")
									setTheme({ style: "system" })
									setStyle("system")
								}}
								tw="flex items-center gap-2"
							>
								<Half2Icon />
								<span tw="pointer-events-none capitalize">System</span>
							</CommandItem>
							<CommandItem
								onSelect={() => {
									localStorage.setItem("theme.style", "light")
									setTheme({ style: "light" })
									setStyle("light")
								}}
								tw="flex items-center gap-2"
							>
								<SunIcon />
								<span tw="pointer-events-none capitalize">Light</span>
							</CommandItem>
							<CommandItem
								onSelect={() => {
									localStorage.setItem("theme.style", "dark")
									setTheme({ style: "dark" })
									setStyle("dark")
								}}
								tw="flex items-center gap-2"
							>
								<MoonIcon />
								<span tw="pointer-events-none capitalize">Dark</span>
							</CommandItem>
						</CommandList>
					</PopoverClose>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
