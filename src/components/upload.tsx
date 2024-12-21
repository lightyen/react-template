import { useCallback, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"
import { composeRefs } from "./lib"

interface UploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
	ref?: React.Ref<HTMLInputElement>
}

export function MdiCloudUpload(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M11 20H6.5q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48q1.18-1.53 3.08-1.95q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1.88-1.31 3.19T18.5 20H13v-7.15l1.6 1.55L16 13l-4-4l-4 4l1.4 1.4l1.6-1.55Z"
			></path>
		</svg>
	)
}

export function MdiFile(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
			></path>
		</svg>
	)
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

		const s: string[] = []
		if (files) {
			for (const f of files) {
				s.push(f.name)
			}
		}

		if (s.length) {
			labelRef.current.setAttribute("data-file", "")
		} else {
			labelRef.current.removeAttribute("data-file")
		}
		setName(s.join("\n"))
	}, [])
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
				e.preventDefault()
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
