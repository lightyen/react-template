import { type Meta, type StoryObj } from "@storybook/react"
import { Button } from "~/components/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/dialog"
import { Input } from "~/components/input"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Dialog",
	component: Dialog,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		// ref: {
		// 	table: {
		// 		disable: true,
		// 	},
		// },
	},
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: "Button",
	},
	render(props) {
		return (
			<Dialog {...props}>
				<DialogTrigger>
					<Button data-testid="dialog" variant="outline">
						Dialog
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when you&apos;re done.
						</DialogDescription>
					</DialogHeader>
					<Input autoFocus type="text" placeholder="username" />
					<DialogFooter>
						<DialogClose>
							<Button type="submit">Done</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	},
}
