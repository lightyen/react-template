import { useLoaderData } from "react-router"

export function Component() {
	const data = useLoaderData()
	return <div tw="my-6 text-xl">Content {String(data)}</div>
}
