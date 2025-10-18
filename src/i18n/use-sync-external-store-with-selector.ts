/* eslint-disable react-hooks/immutability */

// Source: https://github.com/facebook/react/blob/4049cfeeab33146e02b0721477fd5f2020f76a04/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function is(x: unknown, y: any) {
	return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y)
}

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
	subscribe: (onStoreChange: () => void) => () => void,
	getSnapshot: () => Snapshot,
	getServerSnapshot: void | undefined | (() => Snapshot),
	selector: (snapshot: Snapshot) => Selection,
	isEqual?: (a: Selection, b: Selection) => boolean,
): Selection {
	type Instance<Selection> =
		| {
				hasValue: true
				value: Selection
		  }
		| {
				hasValue: false
				value: null
		  }

	const instRef = useRef<Instance<Selection> | null>(null)

	let inst: Instance<Selection>
	if (instRef.current === null) {
		inst = {
			hasValue: false,
			value: null,
		}
		instRef.current = inst
	} else {
		inst = instRef.current
	}

	const [getSelection, getServerSelection] = useMemo(() => {
		// Track the memoized state using closure variables that are local to this
		// memoized instance of a getSnapshot function. Intentionally not using a
		// useRef hook, because that state would be shared across all concurrent
		// copies of the hook/component.
		let hasMemo = false
		let memoizedSnapshot: Snapshot
		let memoizedSelection: Selection

		const memoizedSelector = (nextSnapshot: Snapshot) => {
			if (!hasMemo) {
				// The first time the hook is called, there is no memoized result.
				hasMemo = true
				memoizedSnapshot = nextSnapshot
				const nextSelection = selector(nextSnapshot)
				if (isEqual !== undefined) {
					// Even if the selector has changed, the currently rendered selection
					// may be equal to the new selection. We should attempt to reuse the
					// current value if possible, to preserve downstream memoizations.
					if (inst.hasValue) {
						const currentSelection = inst.value
						if (isEqual(currentSelection, nextSelection)) {
							memoizedSelection = currentSelection
							return currentSelection
						}
					}
				}
				memoizedSelection = nextSelection
				return nextSelection
			}

			// We may be able to reuse the previous invocation's result.
			const prevSnapshot = memoizedSnapshot
			const prevSelection = memoizedSelection

			if (is(prevSnapshot, nextSnapshot)) {
				// The snapshot is the same as last time. Reuse the previous selection.
				return prevSelection
			}

			// The snapshot has changed, so we need to compute a new selection.
			const nextSelection = selector(nextSnapshot)

			// If a custom isEqual function is provided, use that to check if the data
			// has changed. If it hasn't, return the previous selection. That signals
			// to React that the selections are conceptually equal, and we can bail
			// out of rendering.
			if (isEqual?.(prevSelection, nextSelection)) {
				// The snapshot still has changed, so make sure to update to not keep
				// old references alive
				memoizedSnapshot = nextSnapshot
				return prevSelection
			}

			memoizedSnapshot = nextSnapshot
			memoizedSelection = nextSelection
			return nextSelection
		}

		// Assigning this to a constant so that Flow knows it can't change.
		const maybeGetServerSnapshot = getServerSnapshot === undefined ? null : getServerSnapshot
		const getSnapshotWithSelector = () => memoizedSelector(getSnapshot())
		const getServerSnapshotWithSelector =
			maybeGetServerSnapshot === null ? undefined : () => memoizedSelector(maybeGetServerSnapshot())
		return [getSnapshotWithSelector, getServerSnapshotWithSelector]
	}, [inst, getSnapshot, getServerSnapshot, selector, isEqual])

	const value = useSyncExternalStore(subscribe, getSelection, getServerSelection)

	useEffect(() => {
		inst.hasValue = true
		inst.value = value
	}, [inst, value])

	return value
}
