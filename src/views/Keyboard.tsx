import { useEffect, useState } from "react"
import { tw } from "twobj"
import { KeyState, useGlobalKeys, useKeyStore } from "~/utils/global-keys"

function useKeyboard() {
	const [mounted, setMount] = useState(false)
	useGlobalKeys(mounted)
	useEffect(() => {
		setMount(true)
		return () => {
			setMount(false)
		}
	}, [])
}

function MyKeyboard() {
	const state = useKeyStore(state => state.keys["KC_1"])
	return <div css={state === KeyState.KeyDown && tw`text-orange-500`}>KC_1</div>
}
