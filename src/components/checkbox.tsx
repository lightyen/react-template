import { CheckIcon, ChevronDownIcon, DividerHorizontalIcon } from "@radix-ui/react-icons"
import { useEffect, useMemo, useRef, useState, type InputHTMLAttributes, type Ref } from "react"
import { useFormContext, type FieldValues, type Path } from "react-hook-form"
import { tw } from "twobj"
import { composeRefs } from "./lib/compose"

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	intermediate?: boolean | undefined
	ref?: Ref<HTMLInputElement>
	squared?: boolean
}

export function Checkbox({ type: _, intermediate, squared, className, ref, children, ...props }: CheckboxProps) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	useEffect(() => {
		if (intermediate != undefined) {
			if (inputRef.current) {
				inputRef.current.indeterminate = intermediate
			}
		}
	}, [intermediate])

	return (
		<label
			tw="flex items-center relative select-none cursor-pointer text-current
			hover:[input:not(:checked):not(:disabled):not(:indeterminate) ~ .check > .checkmark]:bg-primary/20
			focus-within:outline-none
			"
			className={className}
		>
			<input
				type="checkbox"
				ref={composeRefs(ref, inputRef)}
				tw="absolute w-0 h-0
				[&:checked ~ .check > .checkmark]:(bg-primary text-primary-foreground)
				[&:not(:checked) ~ .check > .checkmark .checked_icon]:hidden
				[&:indeterminate ~ .check > .checkmark]:(bg-primary text-primary-foreground)
				[&:indeterminate ~ .check > .checkmark .checked_icon]:hidden
				[&:not(:indeterminate) ~ .check > .checkmark .indeterminated_icon]:hidden
				[&:indeterminate ~ .check > .checkmark .indeterminated_icon]:visible
				focus-visible:[& ~ .check > .checkmark]:(shadow-primary/30 shadow-[0 0 0 3px var(--tw-shadow-color)])
				"
				{...props}
			/>
			<div className="check" tw="w-[25px] h-[25px] flex items-center justify-center">
				<span
					className="checkmark"
					tw="flex items-center justify-center w-[18px] h-[18px] border-2 border-primary transition-[ box-shadow] duration-150"
					css={!squared && tw`rounded-full`}
				>
					<CheckIcon className="checked_icon" />
					<DividerHorizontalIcon className="indeterminated_icon" />
				</span>
			</div>
			{children && <span tw="px-[5px] leading-none font-medium">{children}</span>}
		</label>
	)
}
Checkbox.displayName = "Checkbox"

export interface CheckboxTreeNode<T extends FieldValues = FieldValues> {
	label: string
	children?: (CheckboxTreeNode<T> | LeafNode<T>)[]
}

interface LeafNode<T extends FieldValues> {
	label: string
	value: string
	id: Path<T>
}

function isLeaf<T extends FieldValues>(node: CheckboxTreeNode<T> | LeafNode<T>): node is LeafNode<T> {
	if (typeof node["id"] === "string") {
		return true
	}
	return false
}

function watchedArray<T extends FieldValues>(node: CheckboxTreeNode<T>) {
	const watched = new Set<Path<T>>()
	node.children?.forEach(c => {
		if (isLeaf(c)) {
			watched.add(c.id)
			return
		}
		c.children?.forEach(v => {
			if (isLeaf(v)) {
				watched.add(v.id)
				return
			}
			const arr = watchedArray(v)
			arr.forEach(watched.add)
		})
	})
	return Array.from(watched)
}

export function CheckboxTree<T extends FieldValues>({ nodes }: { nodes: CheckboxTreeNode<T>[] }) {
	return nodes.map((v, i) => (
		<li key={i} tw="list-none">
			<CheckboxTreeNode node={v} />
		</li>
	))
}
CheckboxTree.displayName = "CheckboxTree"

function CheckboxTreeNode<T extends FieldValues>({ node }: { node: CheckboxTreeNode<T> | LeafNode<T> }) {
	if (isLeaf(node)) {
		return <CheckboxLeaf item={node} />
	}
	return <CheckboxTreeItem node={node} />
}

function CheckboxLeaf<T extends FieldValues>({ item }: { item: LeafNode<T> }) {
	const { register } = useFormContext<T>()
	return (
		<label tw="flex-initial cursor-pointer">
			<span tw="flex items-center">
				<div tw="flex items-center">
					<Checkbox squared {...register(item.id)}>
						{item.label}
					</Checkbox>
				</div>
			</span>
		</label>
	)
}

function CheckboxTreeItem<T extends FieldValues>({ node }: { node: CheckboxTreeNode<T> }) {
	const [visible, setVisible] = useState(false)
	return (
		<>
			<CheckboxTreeHeader node={node} visible={visible} onToggle={setVisible} />
			{node.children && node.children.length > 0 && visible && (
				<ol tw="pl-[50px]">
					<CheckboxTree nodes={node.children} />
				</ol>
			)}
		</>
	)
}

function CheckboxTreeHeader<T extends FieldValues>({
	node,
	visible,
	onToggle,
}: {
	node: CheckboxTreeNode<T>
	visible: boolean
	onToggle(visible: boolean): void
}) {
	const { setValue, watch } = useFormContext<T>()
	const names = watchedArray(node)
	const values = watch(names)
	const checked = useMemo(() => {
		if (values.length === 0) {
			return false
		}
		return values.reduce((prev, cur) => prev && cur)
	}, [values])
	const intermediate = useMemo(() => {
		let cur: boolean | null = null
		let int = false
		for (const v of values) {
			if (cur == null) {
				cur = Boolean(v)
				continue
			}
			if (cur !== Boolean(v)) {
				int = true
				break
			}
		}
		return int
	}, [values])
	return (
		<div tw="flex">
			<button
				type="button"
				tw="inline-flex justify-center items-center w-[25px] h-[25px] text-foreground/40 stroke-foreground/40 hover:(text-foreground stroke-foreground)"
				onClick={() => onToggle(!visible)}
			>
				<ChevronDownIcon tw="stroke-2" css={!visible && tw`-rotate-90`} />
			</button>
			<label tw="flex-initial cursor-pointer">
				<span tw="flex items-center">
					<div tw="">
						<Checkbox
							squared
							checked={checked}
							intermediate={intermediate}
							onChange={e => {
								for (const name of names) {
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									setValue(name, e.target.checked as any)
								}
							}}
						>
							{node.label}
						</Checkbox>
					</div>
				</span>
			</label>
		</div>
	)
}
