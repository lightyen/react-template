import { CheckIcon, ChevronDownIcon, DividerHorizontalIcon } from "@radix-ui/react-icons"
import { useEffect, useMemo, useRef, useState, type InputHTMLAttributes, type Ref } from "react"
import { useFormContext, type FieldValues, type Path } from "react-hook-form"
import { tw } from "twobj"
import { composeRefs } from "./lib/compose"

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	intermediate?: boolean | undefined
	ref?: Ref<HTMLInputElement>
	rounded?: boolean
}

export function Checkbox({
	type: _,
	intermediate,
	rounded,
	disabled,
	className,
	ref,
	children,
	...props
}: CheckboxProps) {
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
			tw="inline-flex items-center relative select-none cursor-pointer text-current focus-within:outline-none
				hover:[input:not(:checked):not(:disabled):not(:indeterminate) ~ .check > .checkmark]:bg-primary/20
			"
			css={disabled && tw`pointer-events-none opacity-50`}
			className={className}
		>
			<input
				type="checkbox"
				ref={composeRefs(ref, inputRef)}
				tw="absolute w-0 h-0
					checked:[& ~ .check > .checkmark]:(bg-primary text-primary-foreground)
					[&:not(:checked) ~ .check > .checkmark .checked_icon]:hidden
					indeterminate:[& ~ .check > .checkmark]:(bg-primary text-primary-foreground)
					indeterminate:[& ~ .check > .checkmark .checked_icon]:hidden
					indeterminate:[& ~ .check > .checkmark .indeterminated_icon]:visible
					[&:not(:indeterminate) ~ .check > .checkmark .indeterminated_icon]:hidden
					focus-visible:[& ~ .check > .checkmark]:(shadow-primary/30 shadow-[0 0 0 3px var(--tw-shadow-color)])
				"
				disabled={disabled}
				{...props}
			/>
			<div className="check" tw="w-[25px] h-[25px] flex items-center justify-center">
				<span
					className="checkmark"
					tw="w-[18px] h-[18px] flex items-center justify-center border-2 border-primary transition-[box-shadow] duration-150"
					css={rounded && tw`rounded-full`}
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

export type CheckboxTreeNode<T extends FieldValues = FieldValues> = CheckboxInternalNode<T> | LeafNode<T>

interface CheckboxInternalNode<T extends FieldValues = FieldValues> {
	label: string
	children: (CheckboxInternalNode<T> | LeafNode<T>)[]
	defaultCollapse?: boolean
}

interface LeafNode<T extends FieldValues> {
	label: string
	id: Path<T>
}

function isLeaf<T extends FieldValues>(node: CheckboxTreeNode<T>): node is LeafNode<T> {
	if (typeof node["id"] === "string") {
		return true
	}
	return false
}

function watchedArray<T extends FieldValues>(node: CheckboxInternalNode<T>) {
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
	return (
		<ol tw="leading-none">
			{nodes.map((v, i) => (
				<li key={i} tw="list-none">
					<CheckboxTreeNode node={v} />
				</li>
			))}
		</ol>
	)
}
CheckboxTree.displayName = "CheckboxTree"

function CheckboxTreeNode<T extends FieldValues>({ node }: { node: CheckboxTreeNode<T> }) {
	if (isLeaf(node)) {
		return <CheckboxLeaf item={node} />
	}
	return <CheckboxTreeGroup node={node} />
}

function CheckboxLeaf<T extends FieldValues>({ item }: { item: LeafNode<T> }) {
	const { register } = useFormContext<T>()
	return <Checkbox {...register(item.id)}>{item.label}</Checkbox>
}

function CheckboxTreeGroup<T extends FieldValues>({ node }: { node: CheckboxInternalNode<T> }) {
	const [visible, setVisible] = useState(() => !node.defaultCollapse)
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
	node: CheckboxInternalNode<T>
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
			<div tw="w-[25px] h-[25px] flex justify-center items-center">
				<button
					type="button"
					tw="w-[18px] h-[18px] flex justify-center items-center text-foreground/40 stroke-foreground/40 focus-within:outline-none
					hover:(text-foreground stroke-foreground)
					focus-visible:(shadow-primary/30 shadow-[0 0 0 3px var(--tw-shadow-color)])
				"
					onClick={() => onToggle(!visible)}
				>
					<ChevronDownIcon tw="stroke-2" css={!visible && tw`-rotate-90`} />
				</button>
			</div>
			<Checkbox
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
	)
}
