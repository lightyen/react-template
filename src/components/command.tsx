import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Command as CommandPrimitive } from "cmdk"
import { Dialog, DialogContent, type DialogProps } from "./dialog"

export function Command(props: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			tw="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground border shadow-md"
			{...props}
		/>
	)
}
Command.displayName = CommandPrimitive.displayName

export function CommandDialog({ children, ...props }: React.PropsWithChildren<DialogProps>) {
	return (
		<Dialog {...props}>
			<DialogContent tw="p-0">
				<Command
					tw="
					[& [cmdk-group-heading]]:(px-2 font-medium text-muted-foreground)
					[& [cmdk-group]]:px-1
					[& [cmdk-group]:not([hidden]) ~[cmdk-group]]:pt-0
					[& [cmdk-input-wrapper] svg]:(h-5 w-5)
					[& [cmdk-input]]:h-12
					[& [cmdk-item]]:(px-2 py-3)
					[& [cmdk-item] svg]:(h-5 w-5)
				"
				>
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	)
}

export function CommandInput(props: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<div tw="flex items-center border-b px-3">
			<MagnifyingGlassIcon tw="mr-2 h-4 w-4 shrink-0 opacity-50" />
			<CommandPrimitive.Input
				tw="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:(pointer-events-none opacity-50)"
				{...props}
			/>
		</div>
	)
}
CommandInput.displayName = CommandPrimitive.Input.displayName

export function CommandList(props: React.ComponentProps<typeof CommandPrimitive.List>) {
	return <CommandPrimitive.List tw="overflow-y-auto overflow-x-hidden" {...props} />
}
CommandList.displayName = CommandPrimitive.List.displayName

export function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return <CommandPrimitive.Empty tw="py-6 text-center text-sm" {...props} />
}
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

export function CommandGroup(props: React.ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			tw="overflow-hidden p-1 text-foreground [& [cmdk-group-heading]]:(px-2 py-1.5 text-xs font-medium text-muted-foreground)"
			{...props}
		/>
	)
}
CommandGroup.displayName = CommandPrimitive.Group.displayName

export function CommandSeparator(props: React.ComponentProps<typeof CommandPrimitive.Separator>) {
	return <CommandPrimitive.Separator tw="-mx-1 h-px bg-border" {...props} />
}
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

export function CommandItem(props: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			tw="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
		aria-selected:(bg-primary/10 text-primary/80)
		data-[disabled='true']:(pointer-events-none opacity-50)"
			{...props}
		/>
	)
}
CommandItem.displayName = CommandPrimitive.Item.displayName

export function CommandShortcut(props: React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }) {
	return <span tw="ml-auto text-xs tracking-widest text-muted-foreground" {...props} />
}
CommandShortcut.displayName = "CommandShortcut"
