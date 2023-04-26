## 介绍

用于消除react的副作用，在重新渲染前获取useState、useMemo的最新状态值，让你不再担心复杂的状态数据流向问题，大大提升开发体验。

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
    const [ state, setState, curState ] = useSyncState(0)  // 也支持函数式
    const [ memo, curMemo ] = useSyncMemo(() => {
        return curState.current + 100
    }, [curState])
    
    useEffect(() =>{
        setState(1)                     // 也支持函数式更新，参数为不可变数据代理，值为curState.current（不需用.current调用）
        console.log(state)              // 0
        console.log(curState.current)   // 1
        console.log(memo)               // 100
        console.log(curMemo.current)    // 101
    }, [])
    
    return (
        <>
            <div>{ state }</div>
            <div>{ memo }</div>
        </>
    )
}
```

## Hook介绍

* ### useSyncState(value)

函数形式：

```
const [ state, setState, current ] = useSyncState(初始值 | 函数表达式)
```

该hook类似于useState()，接收一个任意类型的参数，但useSyncState多返回一个实时的状态值副本，即返回值的第三个（后文以curState指代），前两个在用法上则与useState的返回值并无二致。其中state表示状态值，用于刷新视图；setState用于同步state和curState的值，也支持函数式更新，参数为不可变数据代理；而curState则表示实时的状态值，即在执行setState()操作之后，能够立刻更新为最新状态值，可用于同步操作，不能用于刷新视图，需以curState.current去调用，参照例子。

注意：由于curState是状态值的一个不可变数据类型代理，因此对其所做的任何修改都不会影响到state，本着状态值的不可变性原则，我们可以这样修改状态：

```
const [ state, setState, curState ] = useSyncState([
    { x: 0, y: 1 }
])

curState.current[0].x = 100
setState(curState.current)  // setState内部会自动将不可变对象转换为正常对象
```

同时，setState的函数式更新所带参数也是一个不可变对象，并且不需要通过current调用，用法与useImmer一样， 如下：

```
const [ state, setState, curState ] = useSyncState([
    { x: 0, y: 1 }
])

setState(prev => {
    prev[0].x = 100
    return prev
})
```

useSyncState又是如何消除副作用的呢？我们看以下例子：

```
import { useState, useEffect } from 'react'

export default MyComponent = () => {
    const [ A, setA ] = useState(0)
    const [ B, setB ] = useState(0)

    let request = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setA(1)
                resolve()
            }, 500)
        })
    }

    useEffect(() =>{
        request()
    }, [])

    useEffect(() =>{
        // 每次A更新都会执行
        setB(A + 10)
    }, [A])

    return (
        <div>{ B }</div>
    )
}
```

这个例子表示有一个状态A需要异步获取，获取之后再根据A计算得到状态B的值，这里我们先不讨论用useMemo优化的问题，现在我们用useSyncState来改写看看：

```
import { useEffect } from 'react'
import { useSyncState, useSyncMemo } from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ A, setA, curA ] = useSyncState(0)
    const [ B, setB, curB ] = useSyncState(0)

    let request = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setA(1)
                resolve()
            }, 500)
        })
    }

    useEffect(() =>{
        request().then(() => {
            setB(curA.current + 10)
        })
    }, [])

    return (
        <div>{ B }</div>
    )
}
```

这种写法让副作用变得可控了，不会每次setA都会去更新B，我们后续setA想执行什么副作用就执行什么副作用，不会有额外的心里负担，我们不需要再去考虑数据是怎么流动的，我们把seState当作一个更新视图的函数即可，这样更符合我们的直觉思维。

* ### useSyncMemo(fn[, deps])

函数形式：

```
const [ memo, current ] = useSyncMemo(function(){ 计算函数，最好用状态的current值进行计算 }, [依赖项数组，可传可不传，传的话必须用状态的current值])
```

该hook类似于useMemo()，接收一个计算函数和依赖项数组（也可不传依赖），不同的是返回值中包含memo以及current两个值。注意：如果要显式传依赖项的话，依赖项需为useSyncState()返回的current值，如果想要立刻获取到最新的计算值，计算函数中还需用current值进行计算。如下：

```
import { useEffect } from 'react'
import { useSyncState, useSyncMemo } from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ state, setState, curState ] = useSyncState(0)
    const [ memo, curMemo ] = useSyncMemo(() => {
        return curState.current + 1
    }, [curState])
    
    useEffect(() =>{
        for(let i = 0; i < 5; i++){
            setState(i)
            console.log(memo)      // 0 0 0 0 0
            console.log(curMemo.current)    // 1 2 3 4 5
        }
    }, [])
    
    return (
        <>
            <div>{ memo }</div>
        </>
    )
}
```

不传依赖项的话，计算函数必须用状态值的current进行计算，因为useSyncState内部是通过current的getter去判断依赖的，如下所示：

```
import { useEffect } from 'react'
import { useSyncState, useSyncMemo } from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ state, setState, curState ] = useSyncState(0)
    const [ memo, curMemo ] = useSyncMemo(() => {
        return curState.current + 1
    })
    
    useEffect(() =>{
        for(let i = 0; i < 5; i++){
            setState(i)
            console.log(memo)      // 0 0 0 0 0
            console.log(curMemo.current)    // 1 2 3 4 5
        }
    }, [])
    
    return (
        <>
            <div>{ memo }</div>
        </>
    )
}
```

* ### \_getImmutableCopy\_(value)

不可变对象代理的解包函数，在极少数情况下，我们可能需要手动解包，保险起见还是预留了该函数。

```
import { _getImmutableCopy_ } from 'react-sync-state-hook'

const [ state, setState, curState ] = useSyncState({a: 0})
const copy = _getImmutableCopy_(curState)
```