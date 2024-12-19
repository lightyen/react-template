interface UploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
	ref?: React.Ref<HTMLInputElement>
}

export function Upload({ className, style, ...props }: UploadProps) {
	return (
		<label tw="relative select-none" className={className} style={style}>
			<input type="file" tw="absolute w-0 h-0" />
			<span></span>
		</label>
	)
}
