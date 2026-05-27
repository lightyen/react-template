export function Article({ children }: React.PropsWithChildren<{}>) {
	return <article tw="flex flex-col gap-5 sm:max-w-xl pt-7 px-6 my-10 bg-card rounded-xl">{children}</article>
}
