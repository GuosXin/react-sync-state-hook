## 介绍

能够在React中使用同步操作的State Hook，更优雅地处理useState的异步问题。

## 兼容性

| react | react-native |
| ----- | ------------ |
| >= 16.9.0 | >= 0.66  |

## 安装

在现有项目中使用：

```bash
npm i react-sync-state-hook
```

或者

```bash
yarn add react-sync-state-hook
```

## 快速上手

```js
import { useEffect } from 'react'
import { useSyncState } from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ state, setState, current ] = useSyncState('initVal')
    
    useEffect(() =>{
        setState('updateVal')
        console.log(state)     // initVal
        console.log(current.current)    // updateVal
    }, [])
    
    // state用于刷新视图，current.current用于同步操作
    // 注意：如果直接修改current值的话，切记修改完后要再调用一次setState方法同步一下最新值。这样使用current也可以实现一些性能上的优化，减少因修改state带来的重新渲染次数。
    
    return (
        <div>{ state }</div>
    )
}
```
