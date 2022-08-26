## 介绍

能够在React中使用同步的State Hook，更优雅地处理useState的异步问题。

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
import useSyncState from 'react-sync-state-hook'

export default MyComponent = () => {
    const [ asyncState, setState, syncState ] = useSyncState('initVal')
    
    useEffect(() =>{
        setState('updateVal')
        console.log(asyncState)     // initVal
        console.log(syncState.value)    // updateVal
    }, [])
    
    // asyncState用于刷新视图，syncState.value用于同步操作
    return (
        <div>{ asyncState }</div>
    )
}
```
