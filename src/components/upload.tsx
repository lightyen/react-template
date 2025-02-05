import { useRef } from "react"
import { composeRefs } from "./lib"

export interface UploadHandler {
	onFiles?: (files: FileList | null) => void
}

export interface DropareaProps extends UploadHandler, React.HTMLAttributes<HTMLDivElement> {
	ref?: React.Ref<HTMLDivElement>
}

interface UseDragDropReturn<T> {
	register(options?: { ref?: React.Ref<T>; overAttr?: string }): {
		ref(node: T): void
		onDragOver(e: React.DragEvent<T>): void
		onDrop(e: React.DragEvent<T>): void
		onDragLeave(e: React.DragEvent<T>): void
	}
}

/**
 * @example
 *
 * ```tsx
 * // useDragDrop()
 * // the "data-over" attribute
 *
 * function Component() {
 * 	const { register } = useDragDrop<HTMLDivElement>({ onFiles })
 * 	return <div {...register({ ref, overAttr })} />
 * }
 * ```
 */
export function useDragDrop<E extends HTMLElement>({ onFiles }: UploadHandler = {}): UseDragDropReturn<E> {
	const ref = useRef<E>(null)
	return {
		register({ ref: customRef, overAttr = "data-over" } = {}) {
			return {
				ref: composeRefs(ref, customRef),
				onDragOver(e) {
					e.preventDefault()
					e.stopPropagation()
					if (ref.current) {
						ref.current.setAttribute(overAttr, "")
					}
				},
				onDrop(e) {
					e.preventDefault()
					e.stopPropagation()
					if (ref.current) {
						ref.current.removeAttribute(overAttr)
					}
					onFiles?.(e.dataTransfer.files)
				},
				onDragLeave(e) {
					e.preventDefault()
					e.stopPropagation()
					if (ref.current) {
						ref.current.removeAttribute(overAttr)
					}
				},
			}
		},
	}
}

export interface InputFileProps
	extends UploadHandler,
		Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
	ref?: React.Ref<HTMLInputElement>
}

export function InputFile({ onFiles, ...props }: InputFileProps) {
	return (
		<input
			type="file"
			onChange={e => {
				onFiles?.(e.target.files)
			}}
			{...props}
		/>
	)
}
