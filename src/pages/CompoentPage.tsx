import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/accordion"
import { Badge } from "@components/badage"
import { Button } from "@components/button"
import { Checkbox } from "@components/checkbox"
import { Command, CommandItem, CommandList } from "@components/command"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/dialog"
import { isNormalIPv4 } from "@components/form/validate"
import { Input } from "@components/input"
import { Label } from "@components/label"
import { Overlay } from "@components/overlay"
import { Popover, PopoverContent, PopoverTrigger } from "@components/popover"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@components/sheet"
import { CircleLoading } from "@components/spin"
import { Switch } from "@components/switch"
import { RouteTab, RouterTabs } from "@concepts/RouteTabs"
import { useToast } from "@context"
import { PlusIcon } from "@radix-ui/react-icons"
import dayjs from "dayjs"
import { InputHTMLAttributes, forwardRef, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { FormattedMessage } from "react-intl"
import { Outlet, Route, useNavigate } from "react-router-dom"

export const ComponentRoutes = (
	<Route path="components" Component={ComponentPage}>
		<Route index Component={Preview} />
		<Route path="preview" Component={Preview} />
		<Route path="code" Component={Code} />
	</Route>
)

export function ComponentPage() {
	return (
		<article>
			<div tw="whitespace-pre">{dayjs().format("LLLL")}</div>
			<CommonComponents />
			<TabView />
			<FixedComponents />
			<AccordionComponent />
			<FormComponent />
		</article>
	)
}

function CommonComponents() {
	return (
		<div tw="py-7 flex flex-col gap-7">
			<div tw="max-w-xl">
				<h1 tw="font-bold text-lg mb-4">Common</h1>
				<div tw="mb-4 flex flex-wrap gap-3 items-center">
					<Checkbox id="123enale" />
					<Label htmlFor="123enale">Check Item</Label>
					<Button>Button</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="outline">
						<PlusIcon /> Icon
					</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link</Button>
					<Button variant="destructive">Error</Button>
					<Badge>badge</Badge>
					<Badge variant="outline">badge</Badge>
					<Badge variant="secondary">badge</Badge>
					<Waiting />
				</div>
			</div>
		</div>
	)
}

function randomVariant() {
	const n = Math.round(Math.random() * 100) % 3
	switch (n) {
		case 1:
			return "primary"
		case 2:
			return "destructive"
		default:
			return undefined
	}
}

function FixedComponents() {
	const { toast } = useToast()
	return (
		<div tw="py-7 flex flex-col gap-7">
			<div tw="max-w-xl">
				<h1 tw="font-bold text-lg mb-4">Fixed Position</h1>
				<div tw="mb-4 flex gap-3 items-center flex-wrap">
					<SheetDemo />
					<DialogDemo />
					<Button
						variant="outline"
						onClick={() => {
							toast({
								variant: randomVariant(),
								title: "Scheduled: Catch up ",
								description:
									Math.round(Math.random() * 100) % 2 == 0 ? (
										<FormattedMessage id="off" />
									) : (
										"osfb2 n23fns 30n32ibsd sodfwnef sdfoanfwaeo sdofnsafowe sdfosandf asdfaso"
									),
								action: "Accept",
							})
						}}
					>
						Toast
					</Button>
				</div>
			</div>
		</div>
	)
}

function AccordionComponent() {
	return (
		<div tw="py-7 flex flex-col gap-7">
			<div tw="max-w-xl">
				<h1 tw="font-bold text-lg mb-4">Accordion</h1>
				<div tw="mb-4 flex gap-3 items-center">
					<Accordion>
						<AccordionItem>
							<AccordionTrigger>Is it accessible?</AccordionTrigger>
							<AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
						</AccordionItem>
						<AccordionItem>
							<AccordionTrigger>Is it styled?</AccordionTrigger>
							<AccordionContent>
								Yes. It comes with default styles that matches the other components&apos; aesthetic.
								<div tw="mt-5">
									<Popover placement="bottom-start">
										<PopoverTrigger>
											<Button variant="outline">Command</Button>
										</PopoverTrigger>
										<PopoverContent>
											<Command tw="min-w-[150px] p-1">
												<CommandList>
													<CommandItem>AAA</CommandItem>
													<CommandItem>BBB</CommandItem>
													<CommandItem>CCC</CommandItem>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</div>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem>
							<AccordionTrigger>Is it animated?</AccordionTrigger>
							<AccordionContent>
								Yes. It&lsquo;s animated by default, but you can disable it if you prefer.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	)
}

interface FormData {
	ipv4: string
	x: number
	y: number
}

function FormComponent() {
	const methods = useForm<FormData>({
		defaultValues: {
			ipv4: "10.1.1.1",
			x: 0,
			y: 0,
		},
	})

	return (
		<div tw="py-7 flex flex-col gap-7">
			<div tw="max-w-xl">
				<h1 tw="font-bold text-lg mb-4">Form</h1>
				<FormProvider {...methods}>
					<DemoForm />
				</FormProvider>
			</div>
		</div>
	)
}

function validateData(data: FormData) {
	return Number(data.x) + Number(data.y) <= 100
}

const PercentInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
	return (
		<div tw="flex items-center relative">
			<Input tw="pr-6" ref={ref} {...props} />
			<span tw="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none text-foreground/30">%</span>
		</div>
	)
})
PercentInput.displayName = "PercentInput"

function DemoForm() {
	const { register, handleSubmit, getValues, setError, clearErrors, formState } = useForm<FormData>()
	const { errors, isSubmitted } = formState
	const [output, setOutput] = useState("")
	return (
		<form
			tw="grid gap-4 max-w-[600px]"
			onSubmit={handleSubmit(data => {
				if (!validateData(data)) {
					setError("x", { type: "validate" })
					setError("y", { type: "validate" })
					return
				}

				setOutput(JSON.stringify(data))
			})}
		>
			<Input
				placeholder="ipv4"
				aria-invalid={errors.ipv4 != null}
				{...register("ipv4", { validate: value => isNormalIPv4(value, true) })}
			/>
			<PercentInput
				placeholder="x"
				aria-invalid={errors.x != null}
				{...register("x", {
					onChange() {
						if (isSubmitted) {
							if (!validateData(getValues())) {
								setError("x", { type: "validate" })
								setError("y", { type: "validate" })
								return
							}
							clearErrors("x")
							clearErrors("y")
						}
					},
				})}
			/>
			<PercentInput
				placeholder="y"
				aria-invalid={errors.y != null}
				{...register("y", {
					onChange() {
						if (isSubmitted) {
							if (!validateData(getValues())) {
								setError("x", { type: "validate" })
								setError("y", { type: "validate" })
								return
							}
							clearErrors("x")
							clearErrors("y")
						}
					},
				})}
			/>
			{output && <p>{output}</p>}
			<Button type="submit">Apply</Button>
		</form>
	)
}

function TabView() {
	const navigate = useNavigate()
	return (
		<>
			<RouterTabs onNavigate={navigate}>
				<RouteTab title="Preview" to="preview" />
				<RouteTab title="Code" to="code" />
				<div></div>
			</RouterTabs>
			<Outlet />
		</>
	)
}

function Preview() {
	return (
		<div tw="my-5">
			<div tw="mb-3">
				<a
					href="https://www.radix-ui.com/icons"
					tw="hover:underline accent-accent"
					target="_blank"
					rel="noopener noreferrer"
				>
					https://www.radix-ui.com/icons
				</a>
			</div>
			<div tw="mb-3">
				<a
					href="https://floating-ui.com/docs/getting-started"
					tw="hover:underline accent-accent"
					target="_blank"
					rel="noopener noreferrer"
				>
					https://floating-ui.com/docs/getting-started
				</a>
			</div>
			<div tw="mb-8">
				<a
					href="https://ui.shadcn.com/docs"
					tw="hover:underline accent-accent"
					target="_blank"
					rel="noopener noreferrer"
				>
					https://ui.shadcn.com/docs
				</a>
			</div>
			<Switch />
		</div>
	)
}

function Code() {
	return <div></div>
}

function DialogDemo({ depth = 2 }: { depth?: number }) {
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant="outline">Dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				{depth > 0 && <Input autoFocus type="text" placeholder="username" />}
				<DialogFooter>
					{depth > 0 ? (
						<DialogDemo depth={depth - 1} />
					) : (
						<DialogClose>
							<Button type="submit">Done</Button>
						</DialogClose>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function SheetDemo() {
	return (
		<>
			<SheetForm />
			<SheetForm side="left" />
			<SheetForm side="top" />
			<SheetForm side="bottom" />
		</>
	)
}

function SheetForm({ side }: { side?: "top" | "right" | "bottom" | "left" }) {
	return (
		<Sheet>
			<SheetTrigger variant="outline">sheet {side ?? "right"}</SheetTrigger>
			<SheetContent side={side}>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you&#39;re done.
					</SheetDescription>
				</SheetHeader>
				<div tw="grid gap-4 py-4">
					<div tw="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" tw="text-right">
							Name
						</Label>
						<Input autoFocus id="name" tw="col-span-3" />
					</div>
					<div tw="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" tw="text-right">
							Username
						</Label>
						<Input id="username" tw="col-span-3" />
					</div>
				</div>
				<SheetFooter>
					<SheetClose>
						<Button type="submit">
							<FormattedMessage id="apply" />
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

export function Waiting() {
	const [open, setOpen] = useState(false)
	useEffect(() => {
		if (open) {
			window.setTimeout(() => {
				setOpen(false)
			}, 3000)
		}
	}, [open])
	return (
		<>
			<Button onClick={() => setOpen(true)}>Waiting</Button>
			<Overlay visible={open}>
				<div tw="absolute inset-0 grid place-items-center">
					<div tw="flex gap-3 flex-col items-center">
						<CircleLoading tw="w-20 border-8" />
						<div tw="text-2xl">Waiting</div>
					</div>
				</div>
			</Overlay>
		</>
	)
}
