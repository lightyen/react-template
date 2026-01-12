// Source: https://github.com/facebook/react/blob/4049cfeeab33146e02b0721477fd5f2020f76a04/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function is(x: unknown, y: any) {
	return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y)
}

interface Instance<Snapshot, Selection> {
	hasMemo: boolean
	hasValue: boolean
	value: Selection
	memoizedSnapshot: Snapshot
	memoizedSelection: Selection
}

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
	subscribe: (onStoreChange: () => void) => () => void,
	getSnapshot: () => Snapshot,
	getServerSnapshot: void | undefined | (() => Snapshot),
	selector: (snapshot: Snapshot) => Selection,
	isEqual?: (a: Selection, b: Selection) => boolean,
): Selection {
	const instRef = useRef<Instance<Snapshot, Selection>>({
		hasMemo: false,
		hasValue: false,
		value: null!,
		memoizedSnapshot: undefined!,
		memoizedSelection: undefined!,
	})

	const [getSelection, getServerSelection] = useMemo(() => {
		const inst = instRef.current

		// Track the memoized state using closure variables that are local to this
		// memoized instance of a getSnapshot function. Intentionally not using a
		// useRef hook, because that state would be shared across all concurrent
		// copies of the hook/component.

		const memoizedSelector = (nextSnapshot: Snapshot) => {
			if (!inst.hasMemo) {
				// The first time the hook is called, there is no memoized result.
				inst.hasMemo = true
				inst.memoizedSnapshot = nextSnapshot
				const nextSelection = selector(nextSnapshot)

				if (isEqual != null) {
					// Even if the selector has changed, the currently rendered selection
					// may be equal to the new selection. We should attempt to reuse the
					// current value if possible, to preserve downstream memoizations.
					if (inst.hasValue) {
						const currentSelection = inst.value
						if (isEqual(currentSelection, nextSelection)) {
							inst.memoizedSelection = currentSelection
							return currentSelection
						}
					}
				}
				inst.memoizedSelection = nextSelection
				return nextSelection
			}

			// We may be able to reuse the previous invocation's result.
			const prevSnapshot = inst.memoizedSnapshot
			const prevSelection = inst.memoizedSelection

			if (is(prevSnapshot, nextSnapshot)) {
				// The snapshot is the same as last time. Reuse the previous selection.
				return prevSelection
			}

			inst.memoizedSnapshot = nextSnapshot
			const nextSelection = selector(nextSnapshot)

			// If a custom isEqual function is provided, use that to check if the data
			// has changed. If it hasn't, return the previous selection. That signals
			// to React that the selections are conceptually equal, and we can bail
			// out of rendering.
			if (isEqual?.(prevSelection, nextSelection)) {
				return prevSelection
			}

			inst.memoizedSelection = nextSelection
			return nextSelection
		}

		// Assigning this to a constant so that Flow knows it can't change.
		const maybeGetServerSnapshot = getServerSnapshot === undefined ? null : getServerSnapshot
		const getSnapshotWithSelector = () => memoizedSelector(getSnapshot())
		const getServerSnapshotWithSelector =
			maybeGetServerSnapshot === null ? undefined : () => memoizedSelector(maybeGetServerSnapshot())
		return [getSnapshotWithSelector, getServerSnapshotWithSelector]
	}, [getSnapshot, getServerSnapshot, selector, isEqual])

	const value = useSyncExternalStore(subscribe, getSelection, getServerSelection)

	useEffect(() => {
		const inst = instRef.current
		inst.hasValue = true
		inst.value = value
	}, [value])

	return value
}
