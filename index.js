import { useState } from "react";

export default function useSyncState (value) {
    const [ asyncState, setAsyncState ] = useState(value)
    let syncState = { value }
    const setState = (val) => {
        syncState.value = val
        setAsyncState(val)
    }
    return [ asyncState, setState, syncState ]
}