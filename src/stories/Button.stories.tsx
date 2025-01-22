import { PlusIcon } from "@radix-ui/react-icons"
import { type Meta, type StoryObj } from "@storybook/react"
import { Button } from "~/components/button"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Button",
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
	},
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		ref: {
			table: {
				disable: true,
			},
		},
		onClick: {
			table: {
				category: "action",
				type: {
					summary: "((e: MouseEvent) => void)",
				},
			},
			control: false,
		},
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: "Button",
	},
}

export const Large: Story = {
	name: "size: lg",
	args: {
		size: "lg",
		children: "Button",
	},
}

export const Small: Story = {
	name: "size: sm",
	args: {
		size: "sm",
		children: "Button",
	},
}

export const Icon: Story = {
	name: "size: icon",
	args: {
		size: "icon",
	},
	render(props) {
		return (
			<Button {...props}>
				<PlusIcon />
			</Button>
		)
	},
}
