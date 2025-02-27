import { CalendarIcon } from "@radix-ui/react-icons"
import { set } from "date-fns"
import { useState } from "react"
import "react-day-picker/style.css"
import { Button } from "~/components/button"
import { DateTimeFormProps, DateTimePickerForm } from "~/components/DateTimePicker"
import { Dialog, DialogContent, DialogTrigger, useDialog } from "~/components/dialog"
import { Popover, PopoverContent, PopoverTrigger, usePopover } from "~/components/popover"

export function DemoDatePicker() {
	return (
		<div tw="mb-4 flex flex-col gap-4">
			<DemoDatePickerDialog />
			<DemoDatePickerPopover />
		</div>
	)
}

function DemoDatePickerDialog() {
	const [date, setDate] = useState<Date>()
	return (
		<div>
			<DateTimePickerDialog
				value={date ?? set(new Date(), { hours: 0, minutes: 0, seconds: 0 })}
				onSubmit={value => {
					setDate(value)
				}}
				onCancel={() => {
					setDate(undefined)
				}}
			>
				<Button variant="ghost">
					<CalendarIcon />
					Dialog
				</Button>
			</DateTimePickerDialog>
		</div>
	)
}

function DemoDatePickerPopover() {
	const [date, setDate] = useState<Date>()
	return (
		<div>
			<DateTimePickerPopover
				value={date ?? set(new Date(), { hours: 0, minutes: 0, seconds: 0 })}
				onSubmit={value => {
					setDate(value)
				}}
				onCancel={() => {
					setDate(undefined)
				}}
			>
				<Button variant="ghost">
					<CalendarIcon />
					Popover
				</Button>
			</DateTimePickerPopover>
		</div>
	)
}

function DateTimePickerDialog({
	value = new Date(),
	onSubmit,
	onCancel,
	children,
}: React.PropsWithChildren<DateTimeFormProps>) {
	const dialog = useDialog()
	return (
		<Dialog {...dialog}>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent layout={false} tw="w-[350px] pt-8 pb-5 px-5">
				<DateTimePickerForm
					value={value}
					onSubmit={value => {
						onSubmit?.(value)
						dialog.setVisible(false)
					}}
					onCancel={() => {
						onCancel?.()
						dialog.setVisible(false)
					}}
				/>
			</DialogContent>
		</Dialog>
	)
}

function DateTimePickerPopover({
	value = new Date(),
	onSubmit,
	onCancel,
	children,
}: React.PropsWithChildren<DateTimeFormProps>) {
	const popover = usePopover()
	return (
		<Popover placement="bottom-start" {...popover}>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent tw="">
				<DateTimePickerForm
					tw="border rounded-lg bg-background px-5 py-4"
					value={value}
					onSubmit={value => {
						onSubmit?.(value)
						popover.setVisible(false)
					}}
					onCancel={() => {
						onCancel?.()
						popover.setVisible(false)
					}}
				/>
			</PopoverContent>
		</Popover>
	)
}
