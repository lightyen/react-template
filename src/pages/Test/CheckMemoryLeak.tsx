import { useEffect, useState } from "react"
import { Switch } from "~/components/switch"

export function humanizeByteSI(value: number, fixed = 0): string {
	const g = 1e9
	const m = 1e6
	const k = 1e3
	const v = value
	if (v >= g) {
		return Number(v / g).toFixed(fixed) + " GB"
	}
	if (v >= m) {
		return Number(v / m).toFixed(fixed) + " MB"
	}
	if (v >= k) {
		return Number(v / k).toFixed(fixed) + " KB"
	}
	return Number(v).toFixed(0) + " bytes"
}

interface Breakdown {
	bytes: number
	types: string[]
}

interface Result {
	bytes: number
	breakdown: Breakdown[]
}

export function CheckMemoryLeak() {
	const [count, setCount] = useState(0)
	const [result, setResult] = useState<Result | undefined>(undefined)

	useEffect(() => {
		const h = setInterval(() => {
			setCount(c => c + 1)
		}, 1)
		return () => {
			clearInterval(h)
		}
	}, [])

	useEffect(() => {
		let h: number
		function measurementInterval() {
			const MEAN_INTERVAL_IN_MS = 5 * 1000
			return -Math.log(Math.random()) * MEAN_INTERVAL_IN_MS
		}
		async function performMeasurement() {
			try {
				const result = await performance["measureUserAgentSpecificMemory"]()
				setResult(result)
			} catch (error) {
				if (error instanceof DOMException && error.name === "SecurityError") {
					console.log("The context is not secure.")
					return
				}
				throw error
			}
			scheduleMeasurement()
		}
		function scheduleMeasurement() {
			if (!window.crossOriginIsolated) {
				console.log(
					"performance.measureUserAgentSpecificMemory() is only available in cross-origin-isolated pages",
				)
				console.log("See https://web.dev/coop-coep/ to learn more")
				return
			}
			if (!performance["measureUserAgentSpecificMemory"]) {
				console.log("performance.measureUserAgentSpecificMemory() is not available in this browser")
				return
			}
			const interval = measurementInterval()
			// console.log(`Running next memory measurement in ${Math.round(interval / 1000)} seconds`)
			h = window.setTimeout(performMeasurement, interval)
		}
		scheduleMeasurement()
		return () => {
			window.clearTimeout(h)
		}
	}, [])

	return (
		<div>
			<h1>Memory Leak {count}</h1>
			{result && <h2>Size: {humanizeByteSI(result.bytes)}</h2>}
			{/* {result && <pre tw="whitespace-pre-wrap max-w-sm">{JSON.stringify(result, null, 2)}</pre>} */}
			{count > -1 && <Switch />}
		</div>
	)
}
