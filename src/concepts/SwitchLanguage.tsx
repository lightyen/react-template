import { CheckIcon } from "@radix-ui/react-icons"
import { Button } from "~/components/button"
import { Command, CommandItem, CommandList } from "~/components/command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "~/components/popover"
import { useIntl } from "~/i18n"

export function SwitchLanguage() {
	const { locale, locales, setLocale } = useIntl(s => s)
	return (
		<Popover placement="bottom-end">
			<PopoverTrigger>
				<Button type="button" aria-label="Switch Language" variant="ghost" size="icon" tw="rounded-none">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14">
						<path
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m6.5 13.5l3.14-7.33a.39.39 0 0 1 .72 0l3.14 7.33m-5.59-3.29h4.18M.5 2.5h9M5 .5v2m3 0l-6 7m0-7l3.94 4.6"
						/>
					</svg>
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command tw="w-28 p-1">
					<PopoverClose>
						<CommandList>
							<CommandItem value="-" tw="hidden" />
							{Object.entries(locales).map(([key, name]) => {
								return (
									<CommandItem
										key={key}
										data-state={locale === key ? "selected" : ""}
										onSelect={() => setLocale(key)}
										tw="flex justify-between [& svg]:invisible [&[data-state=selected] svg]:visible"
									>
										<span tw="pointer-events-none capitalize">{name}</span>
										<CheckIcon />
									</CommandItem>
								)
							})}
						</CommandList>
					</PopoverClose>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
