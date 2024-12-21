import { UploadIcon } from "@radix-ui/react-icons"
import { useCallback, useRef, useState } from "react"
import { composeRefs } from "./lib"

interface UploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
	ref?: React.Ref<HTMLInputElement>
}

export function Upload({ type: _, onChange, className, style, ref, ...props }: UploadProps) {
	const labelRef = useRef<HTMLLabelElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const [name, setName] = useState("")
	const onFiles = useCallback((files: FileList | null) => {
		if (!labelRef.current || !inputRef.current) {
			return
		}

		const length = files?.length ?? 0

		if (inputRef.current.files?.length != length) {
			inputRef.current.files = files
		}

		let str = ""
		if (files) {
			for (const f of files) {
				str += `${f.name} `
			}
		}

		if (str) {
			labelRef.current.setAttribute("data-file", "")
		} else {
			labelRef.current.removeAttribute("data-file")
		}
		setName(str)
	}, [])
	return (
		<label
			tw="relative select-none box-border flex items-center justify-center rounded-lg
			border-2 border-solid border-input transition
			data-[over]:(border-primary bg-primary/20 border-dashed)
			hover:(
				[&:not([data-file])]:(border-primary bg-primary/20)
				[&[data-file]]:(border-input bg-input/20)
			)
			"
			ref={labelRef}
			className={className}
			style={style}
			onDragOver={e => {
				e.preventDefault()
				e.stopPropagation()
				if (labelRef.current) {
					labelRef.current.setAttribute("data-over", "")
				}
			}}
			onDrop={e => {
				e.preventDefault()
				e.stopPropagation()
				if (labelRef.current) {
					labelRef.current.removeAttribute("data-over")
				}
				onFiles(e.dataTransfer.files)
			}}
			onDragLeave={e => {
				e.stopPropagation()
				if (labelRef.current) {
					labelRef.current.removeAttribute("data-over")
				}
			}}
		>
			<input
				type="file"
				tw="absolute w-0 h-0"
				ref={composeRefs(ref, inputRef)}
				onChange={e => {
					onFiles(e.target.files)
					onChange?.(e)
				}}
				{...props}
			/>
			<div tw="w-full flex items-center justify-center text-lg gap-2 h-20 px-2">
				{name ? (
					<p tw="break-all">
						<span>{name}</span>
					</p>
				) : (
					<>
						<UploadIcon width={20} height={20} />
						<span>Upload files</span>
					</>
				)}
			</div>
		</label>
	)
}
