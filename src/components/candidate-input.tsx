import { forwardRef, useEffect, useRef, useState, type InputHTMLAttributes } from "react"
import { Command, CommandItem, CommandList } from "./command"
import { commandScore } from "./command-score"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface CandidateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onSelect"> {
	candidates: string[]
	onSelect?(value: string): void
}

export const CandidateInput = forwardRef<HTMLInputElement, CandidateInputProps>(
	({ candidates, onSelect, onChange, ...props }, ref) => {
		const innerRef = useRef<HTMLInputElement | null>(null)
		const [showCandidates, setShow] = useState(true)
		useEffect(() => {
			if (innerRef.current) {
				const value = innerRef.current.value
				setShow(fshow(value, candidates))
			}
		}, [candidates])
		function fshow(value: string, candidates: string[]) {
			return value ? candidates.some(c => commandScore(c, value, []) > 0) : true
		}
		return (
			<Popover>
				<div tw="relative">
					<PopoverTrigger triggerType="input">
						<Input
							ref={node => {
								if (!node) {
									return
								}
								innerRef.current = node
								if (typeof ref === "function") {
									ref(node)
								} else if (ref) {
									ref.current = node
								}
							}}
							onChange={e => {
								setShow(fshow(e.target.value, candidates))
								onChange?.(e)
							}}
							{...props}
						/>
					</PopoverTrigger>
					<PopoverContent tw="w-full">
						{showCandidates && (
							<Command tw="p-1">
								<CommandList>
									<CommandItem value="-" tw="hidden" />
									{candidates.map((v, i) => (
										<CommandItem
											key={i}
											onSelect={value => {
												setShow(fshow(value, candidates))
												onSelect?.(value)
											}}
										>
											{v}
										</CommandItem>
									))}
								</CommandList>
							</Command>
						)}
					</PopoverContent>
				</div>
			</Popover>
		)
	},
)
CandidateInput.displayName = "CandidateInput"
