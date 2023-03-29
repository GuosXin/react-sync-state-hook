[English](./README.md) | 简体中文

## 介绍

能够在React中使用同步操作的State Hook，解决useState、useMemo无法获取最新状态的问题，让你不再担心复杂的状态数据流向问题。

## 兼容性

| react | react-native |
| -------- | -------- |
| >= 16.9.0 | >= 0.66 |

## 安装

在现有项目中使用：

```
npm i react-sync-state-hook
```

或者

```
yarn add react-sync-state-hook
```

## 快速上手

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
        // 切记：debug的时候尽量不要直接打印state，容易受到干扰
    }, [])
    
    return (
        <>
            <div>{ state.state }</div>
            <div>{ memo.state }</div>
        </>
    )
}
```

## Hook介绍

* ### useSyncState(initValue)

该hook类似于useState()，接收一个任意类型的参数，区别在于返回值中的state分为state.state以及state.current两个值。其中state.state表示状态值，可用于刷新视图，用法跟useState返回的状态值完全一样。而state.current则表示当前值，即在执行setState()操作之后，能够立刻更新为最新状态值，可用于同步操作，不能用于刷新视图。

注意：state.state和state.current为引用类型时，它们的赋值是一个深拷贝过程，如果直接修改current的话，切记修改完后要再调用一次setState方法更新一下状态值。事实上先对current做修改最后再同步状态值的用法，是可以带来一些性能上的优化的，因为这样能减少因直接修改状态值而带来的渲染次数。

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
                state2.current = 2      // 使用sate2.current
                resolve()
            }, 1000)
        })
    }

    useEffect(() =>{
        Promise.all([request1(), request2()]).then(res => {
            setState2(state1.current + state2.current)
            // 这种用法可以减少渲染次数
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

该hook类似于useMemo()，接收一个计算函数和依赖项数组，不同的是返回一个对象，包含state以及current两个值，其中依赖项数组的元素需为useSyncState()返回的state对象，如果想要立刻获取到最新的状态值，计算函数中还需用依赖项的current值进行计算。

```
import { useEffect } from 'react'
import { useSyncState, useSyncMemo } from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ state, setState ] = useSyncState(0)
    const memo = useSyncMemo(() => {
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