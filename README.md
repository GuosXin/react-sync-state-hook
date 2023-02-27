## 介绍

能够在React中使用同步操作的State Hook，解决useState无法获取最新值的问题。

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
    // 注意：
    // 如果直接修改current的话，切记修改完后要再调用一次setState方法同步一下状态值。
    // 事实上先对current做修改最后再同步状态值的用法，是可以带来一些性能上的优化的，因为能减少因直接修改状态值而带来的渲染次数
    
    return (
        <div>{ state }</div>
    )
}
```
