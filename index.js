import { useState, useRef, useCallback } from 'react'

export const useSyncState = ( initVal ) => {
    const value = typeof initVal === 'function' ? initVal() : initVal

    // 状态值
    const [ asyncState, setAsyncState ] = useState(value)

    // 变量使用useRef
    let syncState = useRef(value)

    // 同步asyncState和syncState.current的值
    const setState = useCallback(( changedVal ) => {
        const val = typeof changedVal === 'function' ? changedVal(syncState.current) : changedVal
        syncState.current = val
        setAsyncState(val)
    }, [])

    // 返回一个数组
    return [ asyncState, setState, syncState ]
}