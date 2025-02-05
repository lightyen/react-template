import { useVirtualizer } from "@tanstack/react-virtual"
import { startTransition, useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { FormattedMessage } from "react-intl"
import { tw } from "twobj"
import { Button } from "~/components/button"
import { Checkbox, CheckboxTree, type CheckboxTreeNode } from "~/components/checkbox"
import { commandScore } from "~/components/command-score"
import { isNormalIPv4, parseMAC } from "~/components/form/validate"
import { Input, SearchInput } from "~/components/input"
import { Label } from "~/components/label"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "~/components/popover"
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from "~/components/slider"
import { Switch } from "~/components/switch"
import { InputFile, useDragDrop } from "~/components/upload"
import { addresses } from "~/data/macaddr"
import { zonenames } from "~/data/zonename"
import { Header, Separator } from "~/pages/common"
import { DemoDatePicker } from "./DateTimePicker"
import { Candidate, SuggestionInput } from "./SuggestionInput"

export function Component() {
	return (
		<article>
			<div tw="max-w-xl bg-card mb-10">
				<Header>Input</Header>
				<InputView />
				<Separator />
				<Header>Switch</Header>
				<SwitchView />
				<Separator />
				<Header>Checkbox</Header>
				<CheckboxView />
				<Separator />
				<Header>Checkbox Tree</Header>
				<DemoCheckboxTree />
				<Separator />
				<Header>Slider</Header>
				<SliderView />
				<Separator />
				<Header>Select</Header>
				<SelectView />
				<Separator />
				<Header>Datetime</Header>
				<DemoDatePicker />
				<Separator />
				<Header>Upload</Header>
				<DemoUpload />
				<Separator />
				<Header>Suggestion</Header>
				<SuggestionView />
				<Separator />
				<Header>Form</Header>
				<FormView />
			</div>
		</article>
	)
}

function InputView() {
	const id = useId()
	return (
		<div tw="grid gap-2">
			<Label htmlFor={id}>Field</Label>
			<Input id={id} placeholder="Type something..." />
			<Label>Field2</Label>
			<Input disabled placeholder="Disabled" />
		</div>
	)
}

function SwitchView() {
	return (
		<div tw="flex items-center gap-2">
			<Switch defaultChecked>on/off</Switch>
			<Switch disabled>on/off</Switch>
			<Switch defaultChecked disabled>
				on/off
			</Switch>
		</div>
	)
}

function CheckboxView() {
	return (
		<div tw="flex items-center gap-2">
			<Checkbox>Enable A</Checkbox>
			<Checkbox rounded>Enable B</Checkbox>
			<Checkbox disabled>Enable A</Checkbox>
			<Checkbox rounded disabled>
				Enable B
			</Checkbox>
		</div>
	)
}

function DemoCheckboxTree() {
	interface CheckboxData {
		v1: boolean
		v2: boolean
		v3: boolean
		v4: boolean
		v5: boolean
		v6: boolean
		v7: boolean
		v8: boolean
	}

	const nodes = useMemo<CheckboxTreeNode<CheckboxData>[]>(() => {
		return [
			{
				label: "Group A",
				children: [
					{ id: "v1", label: "Mars" },
					{ id: "v2", label: "Deimos" },
					{ id: "v3", label: "Phobos" },
				],
			},
			{
				label: "Group B",
				defaultCollapse: true,
				children: [
					{ id: "v4", label: "Mars" },
					{ id: "v5", label: "Deimos" },
					{
						label: "Group C",
						children: [{ id: "v6", label: "Mars" }],
					},
				],
			},
			{ id: "v7", label: "Deimos" },
			{ id: "v8", label: "Phobos" },
		]
	}, [])

	const methods = useForm<CheckboxData>({
		defaultValues: {
			v1: false,
			v2: false,
			v3: false,
			v4: false,
			v5: false,
			v6: false,
			// v7: false,
			// v8: false,
		},
	})
	return (
		<FormProvider {...methods}>
			<CheckboxTree nodes={nodes} />
		</FormProvider>
	)
}

const sliderStyle = {
	root: tw`relative flex items-center flex-wrap select-none touch-none w-[300px] h-5 data-[orientation=vertical]:(flex-col w-5 h-[300px])`,
	track: tw`bg-input flex relative grow rounded-full w-full h-[3px] data-[orientation=vertical]:(w-[3px])`,
	range: tw`absolute bg-primary rounded-full h-full data-[orientation=vertical]:(w-full h-auto)`,
	thumb: tw`block w-5 h-5 bg-primary rounded-[10px] transition duration-150 (hover: focus-within:):(shadow-primary/30 shadow-[0 0 0 5px var(--tw-shadow-color)] outline-none)`,
}

function SliderView() {
	const [value, setValue] = useState([10])
	const [value2, setValue2] = useState([30, 80])
	return (
		<div tw="grid gap-4 [grid-template-columns: auto 1fr]">
			<SliderRoot value={value} onValueChange={value => setValue(value)} css={sliderStyle.root}>
				<SliderTrack css={sliderStyle.track}>
					<SliderRange css={sliderStyle.range} />
				</SliderTrack>
				<SliderThumb css={sliderStyle.thumb} aria-label="Volume" />
			</SliderRoot>
			<div>{value[0]}</div>
			<SliderRoot value={value2} onValueCommit={value => setValue2(value)} css={sliderStyle.root}>
				<SliderTrack css={sliderStyle.track}>
					<SliderRange css={sliderStyle.range} />
				</SliderTrack>
				<SliderThumb css={sliderStyle.thumb} aria-label="Volume" />
				<SliderThumb css={sliderStyle.thumb} aria-label="Volume" />
			</SliderRoot>
			<div>
				{value2[0]}, {value2[1]}
			</div>
		</div>
	)
}

function SelectView() {
	const id = useId()
	return (
		<div tw="grid gap-2">
			<Label htmlFor={id}>Zonename</Label>
			<ZonenameSelect id={id} />
		</div>
	)
}

function ZonenameSelect({ id }: { id?: string }) {
	const [value, setValue] = useState("Africa/Abidjan")

	const parentRef = useRef<HTMLDivElement>(null)

	const [searchInput, setSearchInput] = useState("")

	const suggestions = useMemo(() => {
		const input = searchInput.trim()
		if (!input) {
			return zonenames
		}
		interface Result {
			score: number
			value: (typeof zonenames)[0]
		}

		const ans = zonenames
			.map<Result>(value => ({ score: commandScore(value, input, []), value }))
			.filter(value => value.score > 0)

		ans.sort((a, b) => {
			return b.score - a.score
		})

		return ans.map(s => s.value)
	}, [searchInput])

	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (visible) {
			setSelectedIndex(-1)
		}
	}, [visible])

	const hovering = useRef(false)
	const keyboard = useRef<Date>(new Date())
	const inputRef = useRef<HTMLInputElement>(null)

	const itemSize = 32

	useEffect(() => {
		const scrollbox = parentRef.current
		if (scrollbox && selectedIndex >= 0 && !hovering.current) {
			if (selectedIndex * itemSize < scrollbox.scrollTop) {
				scrollbox.scrollTo({ top: selectedIndex * itemSize })
			} else if ((selectedIndex + 1) * itemSize > scrollbox.scrollTop + scrollbox.offsetHeight) {
				scrollbox.scrollTo({ top: (selectedIndex + 1) * itemSize - scrollbox.offsetHeight })
			}
		}
	}, [selectedIndex])

	const rowVirtualizer = useVirtualizer({
		count: suggestions.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => itemSize,
		overscan: 30,
	})

	return (
		<Popover
			placement="bottom-start"
			visible={visible}
			setVisible={setVisible}
			onEnter={() => {
				if (inputRef.current) {
					inputRef.current.focus({ preventScroll: true })
				}
			}}
			onLeave={() => {
				setSearchInput("")
			}}
		>
			<PopoverTrigger>
				<Button variant="outline" tw="place-self-start" id={id}>
					{value}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div tw="rounded-md border shadow-lg overflow-hidden">
					<SearchInput
						ref={inputRef}
						tw="focus-within:ring-0 border-0 border-b rounded-b-none"
						onChange={e => {
							const value = e.target.value
							startTransition(() => setSearchInput(value))
						}}
						onKeyDown={e => {
							switch (e.key) {
								case "Enter": {
									const value = suggestions[selectedIndex]
									if (value) {
										setValue(value)
										setVisible(false)
									}
									e.preventDefault()
									return
								}
								case "ArrowDown":
									if (selectedIndex < suggestions.length - 1) {
										hovering.current = false
										keyboard.current = new Date()
										setSelectedIndex(index => index + 1)
									}
									e.preventDefault()
									return
								case "ArrowUp":
									if (selectedIndex > 0) {
										hovering.current = false
										keyboard.current = new Date()
										setSelectedIndex(index => index - 1)
									}
									e.preventDefault()
									return
							}
						}}
						onBlur={() => {
							setVisible(false)
						}}
					/>
					<PopoverClose>
						<div
							aria-label="scroll-container"
							ref={parentRef}
							tw="overflow-auto overscroll-contain max-h-[250px] w-[300px] bg-background"
						>
							<div
								aria-label="items"
								tw="relative w-full whitespace-nowrap"
								style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
							>
								{rowVirtualizer.getVirtualItems().map(({ key, index, size, start }) => {
									const data = suggestions[index]
									return (
										<div
											key={key}
											tw="absolute top-0 left-0 w-full
												flex items-center px-3
												aria-selected:(bg-primary/10 text-primary/80 cursor-pointer)
												"
											aria-selected={index === selectedIndex}
											style={{ height: `${size}px`, transform: `translateY(${start}px)` }}
											onMouseOver={() => {
												const now = new Date()
												if (now.getTime() - keyboard.current.getTime() > 33) {
													hovering.current = true
													setSelectedIndex(index)
												}
											}}
											onClick={() => {
												hovering.current = false
												setValue(data)
												setVisible(false)
												setSelectedIndex(-1)
											}}
										>
											{data}
										</div>
									)
								})}
							</div>
						</div>
					</PopoverClose>
				</div>
			</PopoverContent>
		</Popover>
	)
}

function DemoUpload() {
	return (
		<div>
			<Upload />
		</div>
	)
}

function SuggestionView() {
	const [candidates] = useState(() => addresses.map<Candidate>(v => ({ value: v })))
	const ref = useRef<HTMLInputElement>(null)
	const id = useId()
	return (
		<div tw="grid gap-2">
			<Label htmlFor={id}>MAC</Label>
			<SuggestionInput
				ref={ref}
				id={id}
				candidates={candidates}
				onSelect={({ value }) => {
					if (ref.current) {
						ref.current.value = value
					}
				}}
			/>
		</div>
	)
}

interface MyFormData {
	ipaddr: string
	x: number
	y: number
	mac: string
}

function validateData(data: MyFormData): boolean {
	return Number(data.x) + Number(data.y) <= 100
}

export function FormView() {
	const methods = useForm<MyFormData>({
		defaultValues: {
			ipaddr: "10.1.1.1",
			x: 56,
			y: 12,
			mac: "aa:bb:cc:dd:ee:ff",
		},
	})
	const [output, setOutput] = useState("")
	return (
		<div tw="max-w-xl">
			<form
				tw="grid gap-4"
				onSubmit={methods.handleSubmit(data => {
					if (!validateData(data)) {
						methods.setError("x", { type: "validate" })
						methods.setError("y", { type: "validate" })
						return
					}
					setOutput(JSON.stringify(data, null, 2))
				})}
			>
				<FormProvider {...methods}>
					<FormDetail />
				</FormProvider>
				<div>
					<Button type="submit">Apply</Button>
				</div>
			</form>
			{output && (
				<pre tw="my-4">
					<code>{output}</code>
				</pre>
			)}
		</div>
	)
}

export function PercentInput(
	props: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> },
) {
	return (
		<div tw="flex items-center relative">
			<Input tw="pr-6" {...props} />
			<span tw="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none text-foreground/30">%</span>
		</div>
	)
}
PercentInput.displayName = "PercentInput"

function FormDetail() {
	const methods = useFormContext<MyFormData>()
	const { errors, isSubmitted } = methods.formState
	const [candidates] = useState(() => addresses.map<Candidate>(v => ({ value: v })))
	return (
		<>
			<Input
				placeholder="IPv4"
				aria-invalid={errors.ipaddr != null}
				{...methods.register("ipaddr", { validate: value => isNormalIPv4(value, true) })}
			/>
			<PercentInput
				placeholder="x"
				aria-invalid={errors.x != null}
				{...methods.register("x", {
					onChange() {
						if (!isSubmitted) {
							return
						}
						if (!validateData(methods.getValues())) {
							methods.setError("x", { type: "validate" })
							methods.setError("y", { type: "validate" })
							return
						}
						methods.clearErrors("x")
						methods.clearErrors("y")
					},
				})}
			/>
			<PercentInput
				placeholder="y"
				aria-invalid={errors.y != null}
				{...methods.register("y", {
					onChange() {
						if (!isSubmitted) {
							return
						}
						if (!validateData(methods.getValues())) {
							methods.setError("x", { type: "validate" })
							methods.setError("y", { type: "validate" })
							return
						}
						methods.clearErrors("x")
						methods.clearErrors("y")
					},
				})}
			/>
			<SuggestionInput
				candidates={candidates}
				aria-invalid={errors.mac != null}
				onSelect={({ value }) => {
					methods.setValue("mac", value)
					methods.trigger("mac")
				}}
				{...methods.register("mac", { validate: value => parseMAC(value) != null })}
			/>
		</>
	)
}

function MdiCloudUpload(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M11 20H6.5q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48q1.18-1.53 3.08-1.95q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1.88-1.31 3.19T18.5 20H13v-7.15l1.6 1.55L16 13l-4-4l-4 4l1.4 1.4l1.6-1.55Z"
			></path>
		</svg>
	)
}

function MdiFile(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
			></path>
		</svg>
	)
}

function Upload() {
	const ref = useRef<HTMLLabelElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const [name, setName] = useState("")

	const onFiles = useCallback((files: FileList | null) => {
		if (!ref.current || !inputRef.current) {
			return
		}

		const length = files?.length ?? 0

		if (inputRef.current.files?.length != length) {
			inputRef.current.files = files
		}

		const s: string[] = []
		if (files) {
			for (const f of files) {
				s.push(f.name)
			}
		}

		if (s.length) {
			ref.current.setAttribute("data-file", "")
		} else {
			ref.current.removeAttribute("data-file")
		}
		setName(s.join("\n"))
	}, [])

	const { register } = useDragDrop<HTMLLabelElement>({ onFiles })

	return (
		<label
			tw="relative select-none box-border flex items-center justify-center rounded-xl
				border-2 border-solid border-input transition-colors
				[&[data-file]]:bg-primary/20
				hover:(
					bg-input/20
					[&[data-file]]:(border-primary bg-primary/15)
				)
				[&[data-over]]:(border-primary bg-primary/15 border-dashed)
			"
			{...register({ ref })}
		>
			<InputFile tw="absolute w-0 h-0" ref={inputRef} onFiles={onFiles} />
			<div tw="h-28 w-full flex flex-col items-center justify-center gap-0.5 px-2">
				<div tw="flex justify-center">
					{name ? <MdiFile width={32} height={32} /> : <MdiCloudUpload width={32} height={32} />}
				</div>
				<div tw="text-xl text-center text-balance">
					<p>{name || <FormattedMessage id="upload_file" />}</p>
				</div>
			</div>
		</label>
	)
}
