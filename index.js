import { useState, useRef } from "react";

export function useSyncState (value) {
    const [ asyncState, setAsyncState ] = useState(value)
    let syncState = useRef(value)
    const setState = (val) => {
        syncState.current = val
        setAsyncState(val)
    }
    return [ asyncState, setState, syncState ]
}