import { useState, useRef, useCallback } from 'react'

export const useSyncState = ( initVal ) => {
    // 状态值
    const [ asyncState, setAsyncState ] = useState(initVal)

    // 变量使用useRef
    let syncState = useRef(initVal)

    // 同步asyncState和syncState.current的值
    const setState = useCallback(( changeVal ) => {
        syncState.current = changeVal
        setAsyncState(changeVal)
    }, [])

    // 返回一个数组
    return [ asyncState, setState, syncState ]
}