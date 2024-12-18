function Card(props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
	return <div tw="rounded-xl border bg-card text-card-foreground shadow" {...props} />
}
Card.displayName = "Card"

function CardHeader(props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
	return <div tw="flex flex-col space-y-1.5 p-6" {...props} />
}
CardHeader.displayName = "CardHeader"

function CardFooter(props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
	return <div tw="flex items-center p-6 pt-0" {...props} />
}
CardFooter.displayName = "CardFooter"

function CardTitle(props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
	return <h3 tw="font-semibold leading-none tracking-tight" {...props} />
}
CardTitle.displayName = "CardTitle"

function CardDescription(props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
	return <p tw="text-sm text-muted-foreground" {...props} />
}
CardDescription.displayName = "CardDescription"

function CardContent(props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
	return <div tw="p-6 pt-0" {...props} />
}
CardContent.displayName = "CardContent"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
