import { Cross2Icon } from "@radix-ui/react-icons"
import { createContext, use, useCallback, useEffect, useId, useRef } from "react"
import { tw } from "twobj"
import { create } from "zustand"

export interface TagsInputProps {
	values?: string[]
	placeholder?: string
	splitChars?: string[]
	"aria-invalid"?: boolean
	className?: string
	onChange?(values: string[]): void
	onPaste?(value: string): string[]
}

interface TagsState {
	values: string[]
	focusedIndex: number
	uncommited: string
}

interface TagsAction {
	setFocus(i: number): void
	addValue(v: string): void
	addValues(v: string[]): void
	setValues(v: string[]): void
	removeValue(i: number): void
	removeLastValue(): void
	setValue(i: number, v: string): void
	setUncommited(v: string): void
}

function createTagsStore(init: { values: string[] }) {
	return create<TagsState & TagsAction>()(set => ({
		values: init.values,
		focusedIndex: -1,
		uncommited: "",
		setFocus(i) {
			set(state => ({ ...state, focusedIndex: i }))
		},
		addValue(v) {
			set(state => ({ ...state, values: [...state.values, v] }))
		},
		addValues(v) {
			set(state => ({ ...state, values: [...state.values, ...v] }))
		},
		setValues(v) {
			set(state => ({ ...state, values: v }))
		},
		removeValue(i) {
			set(state => ({ ...state, values: [...state.values.slice(0, i), ...state.values.slice(i + 1)] }))
		},
		removeLastValue() {
			set(state => ({ ...state, values: state.values.slice(0, -1) }))
		},
		setValue(i, v) {
			set(state => ({ ...state, values: [...state.values.slice(0, i), v, ...state.values.slice(i + 1)] }))
		},
		setUncommited(v) {
			set(state => ({ ...state, uncommited: v }))
		},
	}))
}

function useInitTags({ values }: { values?: string[] }) {
	const ref = useRef<ReturnType<typeof createTagsStore>>(null)
	if (!ref.current) {
		ref.current = createTagsStore({ values: values ?? [] })
	}
	return ref.current
}

interface TagEditProps {
	index: number
}

const TagsContext = createContext(null as unknown as ReturnType<typeof createTagsStore>)

function useTagsStore() {
	return use(TagsContext)
}

export function TagsInput({ values, placeholder, splitChars, className, onChange, onPaste, ...props }: TagsInputProps) {
	const store = useInitTags({ values: values })
	const setValues = store(state => state.setValues)
	const setFocus = store(state => state.setFocus)
	const mounted = useRef(false)
	const id = useId()
	useEffect(() => {
		if (mounted.current && values) {
			setValues(values)
			setFocus(-1)
		}
	}, [setValues, setFocus, values])
	useEffect(() => {
		mounted.current = true
		return () => {
			mounted.current = false
		}
	}, [])
	return (
		<div
			tw="px-3 py-0.5 box-border min-h-9 text-sm flex items-center border border-input rounded-md bg-background overflow-hidden"
			css={
				props["aria-invalid"]
					? tw`ring-1 ring-destructive bg-destructive/10`
					: tw`focus-within:(outline-none ring-1 ring-ring)`
			}
			className={className}
		>
			<div tw="flex flex-wrap overflow-auto w-full gap-1 [::-webkit-scrollbar]:h-1">
				<TagsContext.Provider value={store}>
					<TagList onChange={onChange} />
					<DefaultInput id={id} placeholder={placeholder} splitChars={splitChars} onPaste={onPaste} />
				</TagsContext.Provider>
			</div>
		</div>
	)
}
TagsInput.displayName = "TagsInput"

function TagList({ onChange }: { onChange?(values: string[]): void }) {
	const store = useTagsStore()
	const values = store(state => state.values)
	useEffect(() => {
		function onchange(state: TagsState & TagsAction, prev: TagsState & TagsAction) {
			if (onChange) {
				if (state.values.join("") !== prev.values.join("")) {
					onChange(state.values)
				}
			}
		}
		const unsubscribe = store.subscribe(onchange)
		return () => {
			unsubscribe()
		}
	}, [store, values, onChange])
	return values.map((_, i) => <TagEdit key={i} index={i} />)
}

function DefaultInput({
	id,
	placeholder,
	splitChars,
	onPaste,
}: {
	id?: string
	placeholder?: string
	splitChars?: string[]
	onPaste?(value: string): string[]
}) {
	const select = useTagsStore()
	const focusedIndex = select(state => state.focusedIndex)
	const uncommited = select(state => state.uncommited)
	const addValue = select(state => state.addValue)
	const addValues = select(state => state.addValues)
	const setUncommited = select(state => state.setUncommited)
	const removeLastValue = select(state => state.removeLastValue)

	const submit = useCallback(
		(value: string) => {
			addValue(value)
			setUncommited("")
		},
		[addValue, setUncommited],
	)

	if (focusedIndex >= 0) {
		return null
	}

	return (
		<input
			id={id}
			tw="flex-1 min-w-[200px] focus:outline-none bg-transparent placeholder:text-muted-foreground"
			placeholder={placeholder}
			value={uncommited}
			onChange={e => setUncommited(e.target.value)}
			onKeyDown={e => {
				const t = e.target as HTMLInputElement
				const v = t.value

				switch (e.key) {
					case "Enter":
						if (v) {
							e.stopPropagation()
							e.preventDefault()
							submit(v)
							return
						}
						break
					case "Backspace":
						removeLastValue()
						break
					default:
						if (splitChars?.includes(e.key)) {
							e.preventDefault()
							submit(v)
							return
						}
						break
				}
			}}
			onBlur={e => {
				const v = e.target.value
				if (v) {
					submit(e.target.value)
				}
			}}
			onPaste={e => {
				if (onPaste) {
					const paste = e.clipboardData.getData("text")
					const s = onPaste(paste)
					if (s.length > 1) {
						e.preventDefault()
						addValues(s)
					}
				}
			}}
		/>
	)
}

function TagEdit({ index }: TagEditProps) {
	const id = useId()
	const select = useTagsStore()
	const focusedIndex = select(state => state.focusedIndex)
	const value = select(state => state.values[index])
	const setFocus = select(state => state.setFocus)
	const setValue = select(state => state.setValue)
	const removeValue = select(state => state.removeValue)

	const submit = useCallback(
		(value: string) => {
			setFocus(-1)
			setValue(index, value)
		},
		[index, setFocus, setValue],
	)

	if (index === focusedIndex) {
		return (
			<input
				id={id}
				tw="px-1 flex-1 min-w-[250px] focus:outline-none bg-input"
				autoFocus
				defaultValue={value}
				onKeyDown={e => {
					const el = e.target as HTMLInputElement
					switch (e.key) {
						case "Enter":
							e.stopPropagation()
							e.preventDefault()
							submit(el.value)
							break
						case "Escape":
							e.stopPropagation()
							e.preventDefault()
							submit(el.value)
							break
					}
				}}
				onBlur={e => submit(e.target.value)}
			/>
		)
	}

	return (
		<div tw="h-[26px] text-secondary-foreground border whitespace-nowrap flex items-center rounded-sm cursor-pointer">
			<span
				tw="inline-flex items-center h-full px-1.5 pr-1 hover:bg-secondary/80 rounded-l-sm"
				onPointerDown={e => {
					e.preventDefault()
					setFocus(index)
				}}
			>
				{value}
			</span>
			<span
				tw="w-[26px] h-[26px] flex justify-center items-center hover:bg-accent rounded-r-sm"
				onClick={() => removeValue(index)}
			>
				<Cross2Icon />
			</span>
		</div>
	)
}
