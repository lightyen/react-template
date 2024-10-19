import { type CSSObject, type SerializedStyles } from "@emotion/react"
type UserVariants<S> = Record<string, S>

export interface Variants<S> {
	variants: Record<string, UserVariants<S>>
	defaultVariants: {
		[P in keyof Variants<S>["variants"]]: keyof Variants<S>["variants"][P]
	}
}

export type InnerVariantProps<T extends Variants<S>, S> = {
	[P in keyof T["variants"]]?: keyof T["variants"][P]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VariantProps<Fn extends (...args: any) => CSSObject | SerializedStyles[]> = Parameters<Fn>[0]

export function zs<V extends Variants<S>, S extends SerializedStyles = SerializedStyles>(base: S, variants: V) {
	return (props: InnerVariantProps<V, S> = {}): S[] => {
		const s: S[] = [base]
		for (const t in variants.variants) {
			const value = (props[t] as string) ?? variants.defaultVariants[t]
			if (value != null) {
				const styles = variants.variants[t]?.[value]
				if (styles) {
					s.push(styles)
				}
			}
		}
		return s
	}
}
