import { useSelect } from "@context"
import { CaretDownIcon } from "@radix-ui/react-icons"
import { useMemo, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { FormattedMessage } from "react-intl"
import { tw } from "twobj"
import { Button } from "~/components/button"
import { Checkbox } from "~/components/checkbox"

export function Home() {
	const isMobile = useSelect(state => state.app.mobile)
	return (
		<article tw="flex flex-col gap-5">
			<div tw="max-w-xl">
				<h1 tw="font-bold text-lg mb-5">What is Lorem Ipsum? {isMobile ? "mobile" : "desktop"}</h1>
				<p tw="mb-7">
					<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
					been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a
					galley of type and scrambled it to make a type specimen book. It has survived not only five
					centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
					popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
					more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
					Ipsum.
				</p>
			</div>
			<div tw="py-7 flex flex-col gap-7">
				<div tw="max-w-xl">
					<h1 tw="font-bold text-lg mb-4">中文假文產生器</h1>
					<p tw="mb-4">
						本有時候不出的了一下，這篇親卡哈哈戴口罩可能⋯知道是莉的是。類似就是了有弱也想就不，加油ㄉ的力，這兩共很少他不。不意外最愛的動作什，到底是，真天是一樣讓他來才，朋友話說，要不要大概我是就為，人想也只手。
					</p>
					<p tw="mb-4">
						經過，沒有會想⋯來如此要來，真的體的吃東是很聽起可以看：不明不然的快樂網大學生⋯心得我今天。
					</p>
					<p tw="mb-4">
						喜歡的了希望部台灣，也有不好會是困擾這種時也⋯就直接些當我就是是好得很也喜歡，在幹嘛特別知道是那你用下這，他年星期束多人他臨終一次，直接看不是我還沒面就一。
					</p>
				</div>
				<div>
					<a
						href="https://ui.shadcn.com/"
						tw="hover:underline accent-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://ui.shadcn.com/
					</a>
				</div>
			</div>
			<TreeDemo />
		</article>
	)
}

interface FormData {
	v1: boolean
	v2: boolean
	v3: boolean
	v4: boolean
	v5: boolean
	v6: boolean
}

function TreeDemo() {
	const methods = useForm<FormData>({
		defaultValues: {
			v1: false,
			v2: false,
			v3: false,
			v4: false,
			v5: false,
			v6: false,
		},
	})
	return (
		<form
			tw="h-[500px]"
			onSubmit={methods.handleSubmit(data => {
				console.log(data)
			})}
		>
			<FormProvider {...methods}>
				<CheckboxTree items={nodes} />
				<Button type="submit" tw="mt-5">
					<FormattedMessage id="apply" />
				</Button>
			</FormProvider>
		</form>
	)
}

interface TreeItem {
	label: string
	children?: (TreeItem | LeafItem)[]
}

interface LeafItem {
	label: string
	value: string
	id: keyof FormData
}

function isLeaf(item: TreeItem | LeafItem): item is LeafItem {
	if (item["id"]) {
		return true
	}
	return false
}

const nodes: TreeItem[] = [
	{
		label: "AAA",
		children: [
			{ id: "v1", value: "mars", label: "Mars" },
			{ id: "v2", value: "deimos", label: "Deimos" },
			{ id: "v3", value: "phobos", label: "Phobos", children: [] },
		],
	},
	{
		label: "BBB",
		children: [
			{ id: "v4", value: "mars", label: "Mars" },
			{ id: "v5", value: "deimos", label: "Deimos" },
			{ id: "v6", value: "phobos", label: "Phobos", children: [] },
		],
	},
]

function CheckboxTree({ items = [] }: { items: TreeItem[] }) {
	const [show, setShow] = useState(false)
	return items.map((v, i) => (
		<li key={i} tw="list-none">
			<div tw="flex">
				<button
					type="button"
					tw="inline-flex justify-center items-center w-[25px] h-[25px] text-foreground/50 hover:text-foreground"
					onClick={() => {
						setShow(v => !v)
					}}
				>
					<CaretDownIcon css={!show && tw`-rotate-90`} />
				</button>
				<CheckboxTreeItem item={v} />
			</div>
			{v.children && v.children.length > 0 && show && (
				<ol tw="pl-[50px]">
					<CheckboxTreeNested items={v.children} />
				</ol>
			)}
		</li>
	))
}

function CheckboxTreeNested({ items = [] }: { items: (TreeItem | LeafItem)[] }) {
	return items.map((v, i) => {
		return (
			<li key={i} tw="list-none">
				{isLeaf(v) ? (
					<div>
						<CheckboxLeafItem item={v} />
					</div>
				) : (
					<>
						<div tw="flex">
							<CheckboxTreeItem item={v} />
						</div>
						{v.children && <CheckboxTreeNested items={v.children} />}
					</>
				)}
			</li>
		)
	})
}

function watchedArray(item: TreeItem): (keyof FormData)[] {
	const watched = new Set<keyof FormData>()
	for (const c of item.children ?? []) {
		if (isLeaf(c)) {
			watched.add(c.id)
			continue
		}
		if (c.children) {
			c.children.forEach(v => {
				const arr = watchedArray(v)
				arr.forEach(v => {
					watched.add(v)
				})
			})
		}
	}
	return Array.from(watched)
}

function CheckboxTreeItem({ item }: { item: TreeItem }) {
	const { setValue, watch } = useFormContext<FormData>()
	const names = watchedArray(item)
	const values = watch(names)

	const intermediate = useMemo(() => {
		let cur: boolean | null = null
		let int = false
		for (const v of values) {
			if (cur == null) {
				cur = v
				continue
			}
			if (v !== cur) {
				int = true
				break
			}
		}
		return int
	}, [values])

	const checked = values.reduce((prev, cur) => prev && cur)

	return (
		<label tw="flex-initial cursor-pointer">
			<span tw="flex items-center">
				<div tw="w-[25px] h-[25px] flex items-center justify-center">
					<Checkbox
						squared
						checked={checked}
						intermediate={intermediate}
						onChange={e => {
							for (const name of names) {
								setValue(name, e.target.checked)
							}
						}}
					/>
				</div>
				<span tw="px-[5px]">{item.label}</span>
			</span>
		</label>
	)
}

function CheckboxLeafItem({ item }: { item: LeafItem }) {
	const { register } = useFormContext<FormData>()
	return (
		<label tw="flex-initial cursor-pointer">
			<span tw="flex items-center">
				<div tw="w-[25px] h-[25px] flex items-center justify-center">
					<Checkbox squared {...register(item.id)} />
				</div>
				<span tw="px-[5px]">{item.label}</span>
			</span>
		</label>
	)
}
