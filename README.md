English | [简体中文](./public/README-zh_CN.md)

## Introduce

React-ync-state-hook, which can use synchronous operations in React, allow you to get the next state, so that you no longer have to worry about complex state data flow problems.

## Compatibility

| react | react-native |
| -------- | -------- |
| >= 16.9.0 | >= 0.66 |

## Install

Use in an existing project:

```
npm i react-sync-state-hook
```

or

```
yarn add react-sync-state-hook
```

## Quick start

```
import { useEffect } from 'react'
import { useSyncState, useSyncMemo } from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ state, setState ] = useSyncState(0)
    const [ state2, setState2 ] = useSyncState(() => 100)
    const memo = useSyncMemo(() => {
        return state.current + state2.current
    }, [state, state2])
    
    useEffect(() =>{
        setState(1)
        console.log(state.state)     // 0
        console.log(state.current)   // 1
        console.log(memo.state)      // 100
        console.log(memo.current)    // 101
        // When debugging, try not to print the entire state object directly, but print state.state or state.curent, memo is the same, otherwise it is easy to be disturbed
    }, [])
    
    return (
        <>
            <div>{ state.state }</div>
            <div>{ memo.state }</div>
        </>
    )
}
```

## Hook introduction

* ### useSyncState(initValue)

```
import type { Dispatch, SetStateAction } from 'react';
interface SyncState<S> {
    state: S;
    current: S;
}
function useSyncState<S>(initVal: S | (() => S)): [SyncState<S>, Dispatch<SetStateAction<S>>];
```

Some usages:

```
import { useEffect } from 'react'
import { useSyncState, useSyncMemo } from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ state1, setState1 ] = useSyncState(0)
    const [ state2, setState2 ] = useSyncState(0)

    let request1 = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setState1(1)
                resolve()
            }, 500)
        })
    }

    let request2 = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                state2.current = 2      // use state2.current
                resolve()
            }, 1000)
        })
    }

    useEffect(() =>{
        Promise.all([request1(), request2()]).then(res => {
            setState2(state1.current + state2.current)
            // This usage can reduce re-render
        })
    }, [])

    return (
        <>
            <div>{ state1.state }</div>
            <div>{ state2.state }</div>
        </>
    )
}
```

* ### useSyncMemo(fn, arr)

```
import type { Dispatch, SetStateAction } from 'react';
interface SyncState<S> {
    state: S;
    current: S;
}
function useSyncState<S>(initVal: S | (() => S)): [SyncState<S>, Dispatch<SetStateAction<S>>];
```

Some usages:

```
import { useEffect } from 'react'
import { useSyncState, useSyncMemo } from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ state, setState ] = useSyncState(0)
    const memo = useSyncMemo(() => {
        // The next memo can only be got by using state.current
        return state.current + 1
    }, [state])
    
    useEffect(() =>{
        for(let i = 0; i < 5; i++){
            setState(i)
            console.log(memo.state)      // 0 0 0 0 0
            console.log(memo.current)    // 1 2 3 4 5
        }
    }, [])
    
    return (
        <>
            <div>{ memo.state }</div>
        </>
    )
}
```