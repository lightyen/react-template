import { css } from "@emotion/react"
import { ClockIcon } from "@radix-ui/react-icons"
import { getHours, getMinutes, set } from "date-fns"
import { useEffect, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { FormattedMessage } from "react-intl"
import { theme, tw } from "twobj"
import { Button, buttonVariants } from "~/components/button"
import { getDateFnsLocale } from "~/context/intl"
import { Popover, PopoverContent, PopoverTrigger, usePopover } from "./popover"

import "react-day-picker/style.css"

interface FormData {
	date: Date
}

export interface DateTimeFormProps {
	value?: Date
	onSubmit?(value: Date): void
	onCancel?(): void
	className?: string
}

const fontFamily = theme`fontFamily.sans` as string

export function DateTimePickerForm({ value = new Date(), onSubmit, onCancel, className }: DateTimeFormProps) {
	const methods = useForm<FormData>({ defaultValues: { date: value } })
	return (
		<form
			className={className}
			onSubmit={methods.handleSubmit(({ date }) => {
				onSubmit?.(date)
			})}
		>
			<FormProvider {...methods}>
				<Controller
					name="date"
					control={methods.control}
					render={({ field: { onChange, value } }) => {
						return (
							<DayPicker
								selected={value}
								defaultMonth={value}
								mode="single"
								showOutsideDays
								required
								locale={getDateFnsLocale()}
								fixedWeeks
								weekStartsOn={0}
								onSelect={next => {
									onChange(set(next, { hours: getHours(value), minutes: getMinutes(value) }))
								}}
								css={css`
									--rdp-selected-border: 0;
									--rdp-outside-opacity: 0.5;
									--rdp-accent-color: hsl(var(--primary));
									--rdp-selected-border: 2px solid var(--rdp-accent-color);
									--rdp-today-color: var(--rdp-accent-color);
									--rdp-font-family: ${fontFamily};
									.rdp-nav {
										[class^="rdp-chevron"] {
											${tw`opacity-50 hover:opacity-100 fill-foreground`}
										}
									}
									.rdp-day_button {
										--rdp-accent-color: hsl(var(--primary));
										--rdp-selected-border: 2px solid var(--rdp-accent-color);
										--rdp-today-color: var(--rdp-accent-color);
										${[buttonVariants({ variant: "ghost" }), tw`h-9 w-9 p-0`]}
									}
									.rdp-today:not(:has(.rdp-selected)) {
										.rdp-day_button {
											${tw`text-primary font-semibold underline`}
										}
									}
									.rdp-day.rdp-selected {
										--rdp-outside-opacity: 1;
										.day-outside {
											${tw`bg-accent/50`}
										}
										.rdp-day_button {
											${tw`bg-primary text-background focus:(bg-primary text-background) border-0`}
										}
									}
								`}
							/>
						)
					}}
				/>
				<div tw="my-4 flex">
					<Controller
						name="date"
						control={methods.control}
						render={({ field: { onChange, value } }) => {
							const h = getHours(value)
							const m = getMinutes(value)
							return (
								<TimePicker
									tw="w-[100px]"
									value={{ h, m }}
									onChange={({ h, m }) => onChange(set(value, { hours: h, minutes: m }))}
								/>
							)
						}}
					/>
				</div>
				<div tw="flex justify-between gap-3">
					<Button type="button" variant="outline" onClick={onCancel}>
						<FormattedMessage id="cancel" />
					</Button>
					<Button type="submit">
						<FormattedMessage id="apply" />
					</Button>
				</div>
			</FormProvider>
		</form>
	)
}

interface Time {
	h: number
	m: number
}

interface TimePickerProps {
	value?: Time
	onChange?(t: Time): void
	className?: string
}

const active = tw`text-primary`

const scroll = tw`
overflow-y-auto overflow-x-hidden overscroll-contain h-56 scroll-smooth
[::-webkit-scrollbar]:(w-1 h-0)
`

const scrollItem = tw`
h-8 font-normal text-base flex items-center rounded-md
focus:outline-none select-none pl-3 pr-4 transition-colors duration-100
hover:(bg-primary/8 text-primary)
`

function TimePicker(props: TimePickerProps) {
	const refH = useRef<HTMLDivElement>(null)
	const refM = useRef<HTMLDivElement>(null)
	const [time, setTime] = useState<Time>({ h: 0, m: 0 })
	const data = useRef<Time>({ h: 0, m: 0 })

	useEffect(() => {
		if (props.value) {
			let { h, m } = props.value
			if (h >= 0 && h < 24 && m >= 0 && m < 60) {
				h = Math.floor(h)
				m = Math.floor(m)
				data.current = { h, m }
				setTime({ h, m })
			}
		}
	}, [props.value])

	useEffect(() => {
		refH.current?.scrollTo(0, 32 * time.h)
		refM.current?.scrollTo(0, 32 * time.m)
	}, [time])

	function actived(i: number, v: number) {
		return i == v ? active : null
	}

	const popover = usePopover()

	return (
		<Popover placement="bottom-start" {...popover}>
			<PopoverTrigger>
				<div
					tabIndex={0}
					tw="
				select-none outline-none text-base px-2 py-1 h-10 rounded-lg transition
				w-auto flex gap-1 justify-between items-center border"
					className={props.className}
				>
					<span>{String(time.h).padStart(2, "0")}</span>
					<span>:</span>
					<span>{String(time.m).padStart(2, "0")}</span>
					<ClockIcon width={16} height={16} />
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<div
					aria-label="timepicker"
					tw="relative inline-block
				overflow-hidden rounded-lg shadow-lg
				bg-background border"
				>
					<div aria-label="timepicker-content">
						<div tw="flex overflow-hidden p-1">
							<div css={scroll} ref={refH}>
								{new Array(24).fill(null).map((_, i) => {
									return (
										<div
											key={i}
											tabIndex={0}
											css={[scrollItem, actived(i, time.h), tw`w-20`]}
											onClick={() => {
												const t: Time = { h: i, m: time.m }
												data.current = t
												setTime(t)
												props.onChange?.(data.current)
												popover.setVisible(false)
											}}
										>
											{String(i).padStart(2, "0")}
										</div>
									)
								})}
								<div tabIndex={0} aria-label="padding" tw="h-[calc(6 * 32px)] focus:outline-none" />
							</div>
							<div css={scroll} ref={refM}>
								{new Array(60).fill(null).map((_, i) => {
									return (
										<div
											key={i}
											tabIndex={0}
											css={[scrollItem, actived(i, time.m), tw`w-20`]}
											onClick={() => {
												const t: Time = { m: i, h: time.h }
												data.current = t
												setTime(t)
												props.onChange?.(data.current)
												popover.setVisible(false)
											}}
										>
											{String(i).padStart(2, "0")}
										</div>
									)
								})}
								<div tabIndex={0} aria-label="padding" tw="h-[calc(6 * 32px)] focus:outline-none" />
							</div>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
