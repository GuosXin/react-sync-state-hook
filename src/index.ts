import type { Dispatch, SetStateAction } from 'react';
import { useState, useCallback, useMemo } from 'react'
import { createImmutable, getImmutableCopy, getImmutableBase, getImmutableParent, setHandler } from 'handleable-immutable'

let _GET_DEPS_TAG_ = false;
let _DEPS_BUS_: any = []

/**
 * useSyncState
 * @param {*} initVal 初始化值，可以是任意类型的值
 * @returns 
 */
export const useSyncState = <S>( initVal: S | (() => S)): [S, Dispatch<SetStateAction<S>>, any] => {
    // 状态值
    const [ state, setState ] = useState(initVal)

    // 当前值
    let current = createImmutable({ current: state }, {
        get(t, p, r){
            if(_GET_DEPS_TAG_){
                let obj = r
                let parent = getImmutableParent(obj)
                while(parent){
                    obj = parent
                    parent = getImmutableParent(obj)
                }
                _DEPS_BUS_.push(obj)
            }
        },
    })
    
    // 同步state和current的值
    const setValue = useCallback(( changedVal: SetStateAction<S> ) => {
        const val = typeof changedVal === 'function' ? (changedVal as any)(current.current) : changedVal
        current.current = val
        setState(getImmutableCopy(val))
    }, [])
    
    // 返回一个数组
    return [ state, setValue, current ]
}

/**
 * useSyncMemo
 * @param { Function } fn 计算函数
 * @param { Array } arr 受监听的状态数组
 * @returns 
 */
export const useSyncMemo = <T>( fn: () => T, deps?: Array<any> ): any => {
    // 是否需要重新计算
    let recompute = false;
    // 缓存计算结果
    let compute: any;
    
    // 依赖项
    let stateDeps: Array<any> = []

    // 有依赖
    if(deps){
        compute = fn()
        deps?.forEach(item => {
            stateDeps.push(getImmutableBase(item).current)
            setHandler(item, {
                set(){
                    recompute = true
                }
            })
        })
    }
    // 无依赖
    else{
        // 移花接木大法
        _GET_DEPS_TAG_ = true;
        _DEPS_BUS_ = []
        compute = fn()
        const deps = [...new Set(_DEPS_BUS_)]
        _DEPS_BUS_ = []
        _GET_DEPS_TAG_ = false;
        deps.forEach(item => {
            stateDeps.push(getImmutableBase(item).current)
            setHandler(item, {
                set(){
                    recompute = true
                }
            })
        })
    }

    // 状态值
    const memo = useMemo(() => getImmutableCopy(compute), stateDeps)

    // 当前值
    let current = createImmutable({current: memo}, {
        get(){
            if(recompute){
                compute = fn()
                recompute = false
                current.current = compute
            }
        }
    })
    
    // 返回值
    return [memo, current]
}

export const _getImmutableCopy_ = getImmutableCopy