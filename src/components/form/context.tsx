import { createContext, use } from "react"
import type { FieldArrayPath, FieldValues, UseFieldArrayReturn } from "react-hook-form"

const FormArrayContext = createContext<unknown>(null)

export function FormArrayProvider<
	TFieldValues extends FieldValues = FieldValues,
	TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
	TKeyName extends string = "id",
>({ children, ...methods }: React.PropsWithChildren<UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName>>) {
	return <FormArrayContext value={methods}>{children}</FormArrayContext>
}

export function useFormArrayContext<
	TFieldValues extends FieldValues = FieldValues,
	TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
	TKeyName extends string = "id",
>() {
	return use(FormArrayContext) as UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName>
}
