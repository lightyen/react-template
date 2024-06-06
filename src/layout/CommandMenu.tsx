import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/command"
import { useDialog } from "@components/dialog"
import { getDialogCount } from "@components/lib/scrollbar"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function CommandMenu() {
	const navigate = useNavigate()
	const { visible, setVisible } = useDialog()
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				if (!open && getDialogCount() > 0) {
					return
				}
				setVisible(visible => !visible)
			}
		}
		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [setVisible])
	return (
		<div>
			<span tw="text-sm text-muted-foreground whitespace-nowrap cursor-pointer" onClick={() => setVisible(true)}>
				Press{" "}
				<kbd tw="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
					<span tw="text-sm">⌘</span>K
				</kbd>
			</span>
			<CommandDialog visible={visible} setVisible={setVisible}>
				<CommandInput placeholder="Type a command or search..." autoFocus />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem
							onSelect={() => {
								setVisible(false)
								navigate("/")
							}}
						>
							Home
						</CommandItem>
						<CommandItem
							onSelect={() => {
								setVisible(false)
								navigate("/components")
							}}
						>
							Go to Components
						</CommandItem>
						<CommandItem
							onSelect={() => {
								setVisible(false)
								navigate("/test")
							}}
						>
							Go to Test
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</div>
	)
}
