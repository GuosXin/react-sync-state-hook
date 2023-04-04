import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import _ from 'lodash'

/**
 * useSyncState
 * @param {*} initVal 初始化值，可以是任意类型的值
 * @returns 
 */
export const useSyncState = function ( initVal ) {
    // 初始值
    let cloneVal;

    // 状态值
    const [ state, setState ] = useState(() => {
        const value = typeof initVal === 'function' ? initVal() : initVal
        cloneVal = _.cloneDeep(value) // 避免初始值为引用类型时，state和current指向同个地址
        return value
    })

    // 返回值
    const result = useRef({
        current: cloneVal
    }).current

    // state不能在ref中赋值，会失去响应
    Object.defineProperty(result, "state", {
        configurable: true,
        enumerable: true,
        writable: false,
        value: state
    });

    // 同步state和current的值
    const setValue = useCallback(( changedVal ) => {
        const val = typeof changedVal === 'function' ? changedVal(result.current) : changedVal
        result.current = _.cloneDeep(val)
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
    // 是否需要重新计算
    let recompute;

    // 返回值
    const result = useRef({}).current

    useState(() => {
        let compute = fn()
        recompute = false
        Object.defineProperty(result, "current", {
            configurable: true,
            enumerable: true,
            get: () => {
                if(recompute){
                    compute = fn()
                    recompute = false
                    return compute
                }else{
                    return compute
                }
            }
        });
    })

    // memo值
    const memo = useMemo(() => {
        return _.cloneDeep(result.current)
    }, arr.map(item => item.state))

    Object.defineProperty(result, "state", {
        configurable: true,
        enumerable: true,
        writable: false,
        value: memo
    });

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
                    recompute = true
                }
            })
        })
    }, [])

    return result
}