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

export function MemoryLeakTest() {
	return (
		<div tw="p-5">
			<Test1 />
		</div>
	)
}

function Test1() {
	const [count, setCount] = useState(0)
	const [enable, setEnable] = useState(false)
	useEffect(() => {
		let h: number
		function render() {
			setCount(c => c + 1)
			h = window.requestAnimationFrame(render)
		}
		if (enable) {
			h = window.requestAnimationFrame(render)
		}
		return () => {
			window.cancelAnimationFrame(h)
		}
	}, [enable])

	return (
		<fieldset tw="p-3 border border-white">
			<legend tw="text-xs">Test1: {count}</legend>
			<Switch checked={enable} onChange={e => setEnable(e.target.checked)} />
		</fieldset>
	)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MonitorMemorySize() {
	const [result, setResult] = useState<Result | undefined>(undefined)
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

	return result && <span>{humanizeByteSI(result.bytes)}</span>
}
