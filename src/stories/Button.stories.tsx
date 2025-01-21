import { PlusIcon } from "@radix-ui/react-icons"
import { type Meta, type StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { Button, type ButtonProps } from "~/components/button"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Button",
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	// tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		onClick: fn(),
	},
} satisfies Meta<ButtonProps>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
	args: {
		children: "Button",
	},
}

export const Large: Story = {
	args: {
		size: "lg",
		children: "Button",
	},
}

export const Small: Story = {
	args: {
		size: "sm",
		children: "Button",
	},
}

export const Icon: Story = {
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
