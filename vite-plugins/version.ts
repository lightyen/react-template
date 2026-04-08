import { formatISO } from "date-fns"
import { exec, type ExecException } from "node:child_process"
import { type PluginOption } from "vite"

interface Output {
	error: ExecException | null
	stdout: string
	stderr: string
}

async function shell(command: string) {
	return new Promise<Output>(res => {
		exec(command, (error, stdout, stderr) => {
			res({ error, stdout: stdout.trim(), stderr: stderr.trim() })
		})
	})
}

const ver = await gitVersion()

async function gitVersion(): Promise<string> {
	if ((await shell("git rev-parse --git-dir")).error) {
		return "0.0.0"
	}

	let tag = (await shell("git describe --tags --abbrev=0")).stdout
	if (!tag) {
		tag = "0.0.0"
	}

	const current = (await shell("git rev-parse --verify HEAD")).stdout
	if (!current) {
		return `${tag}-untracked`
	}

	if ((await shell("git status --short")).stdout) {
		const short = (await shell("git rev-parse --verify HEAD --short")).stdout
		return `${tag}-untracked+${short}`
	}

	if (
		current ===
		(await shell("git rev-list --max-count=1 " + (await shell("git describe --abbrev=0")).stdout)).stdout
	) {
		return tag
	}

	const branch = (await shell("git rev-parse --abbrev-ref HEAD")).stdout
	const short = (await shell("git rev-parse --verify HEAD --short")).stdout

	return `${tag}-${branch}+${short}`
}

export function version(): PluginOption {
	return {
		name: "git-version",
		enforce: "post",
		buildEnd(err) {
			if (process.env.NODE_ENV !== "production") {
				return
			}
			if (err != null) {
				return
			}

			const json = {
				product_short: process.env.VITE_PRODUCT_SHORT,
				product_name: process.env.VITE_PRODUCT_NAME,
				value: "",
				date: formatISO(new Date()),
			}

			json.value = ver
			this.emitFile({
				type: "asset",
				name: "version.json",
				fileName: "version.json",
				source: JSON.stringify(json) + "\n",
			})
		},
	}
}
