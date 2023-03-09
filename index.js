import { useState, useRef, useCallback, useMemo, useEffect } from 'react'

/**
 * 浅拷贝
 * @param {*} val 
 * @returns 
 */
const clone = function (val){
    let type = Object.prototype.toString.call(val).slice(8, -1)
    if(type === "Date") return new Date(val)
    if(type === "RegExp") return new RegExp(val)
    if(type === "Array") return [...val]
    if(type === "Object") return {...val}
    if(type === "Undefined") return
    return val
}


/**
 * useSyncState
 * @param {*} initVal 初始化值，可以是任意类型的值
 * @returns 
 */
export const useSyncState = function ( initVal ) {
    // 初始值
    const value = useRef(typeof initVal === 'function' ? initVal.call(this) : initVal).current
    const cloneVal = useRef(clone(value)).current    // 避免初始值为引用类型时，state和current指向同个地址，使用深拷贝会影响性能

    // 状态值
    const [ state, setState ] = useState(value)

    // 返回值
    const result = useRef({
        current: cloneVal
    }).current
    result.state = state    // state不能在ref中定义，会失去响应

    // 同步state和current的值
    const setValue = useCallback(( changedVal ) => {
        const val = typeof changedVal === 'function' ? changedVal.call(this, result.current) : changedVal
        result.current = clone(val)   // 避免修改值为引用类型时，state和current指向同个地址，使用深拷贝会影响性能
        setState(val)
    }, [])

    // 返回一个数组
    return [ result, setValue ]
}


/**
 * useSyncMemo
 * @param { Function } fn 计算函数
 * @param { Array } arr 受监听的状态数组
 * @returns 
 */
export const useSyncMemo = function ( fn, arr ) {
    // memo值
    const memo = useMemo(fn, arr.map(item => item.state))
    
    // 返回值
    const result = useRef({
        current: fn.call(this)
    }).current
    result.state = memo

    // 监听current值的setter
    useEffect(() => {
        arr.forEach(item => {
            let current = item.current
            Object.defineProperty(item, 'current', {
                get() {
                    return current
                },
                set(newVal) {
                    current = newVal
                    result.current = fn.call(this)
                }
            })
        })
    }, [])

    return result
}