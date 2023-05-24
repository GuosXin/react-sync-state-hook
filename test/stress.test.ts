/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import { useSyncState, useSyncMemo } from '../src'
import { useState, useMemo, useEffect } from 'react'

test('useSyncState压力对比测试', () => {
    const { result } = renderHook(() => {
        const [ state, setState, curState ] = useSyncState({ name: 'Tome', age: 0, relationship: { father: 'Jone', mother: 'Mary' } })
        const [ memo, curMemo ] = useSyncMemo(() => {
            return curState.current
        })

        useEffect(() => {
            for(let i = 0; i < 1000000; i++){
                curState.current.age = i
                setState(curState.current)
            }
            expect(curState.current.age).toEqual(999999)
            expect(state.age).toEqual(0)
            expect(curMemo.current.age).toEqual(999999)
            expect(memo.age).toEqual(0)
        }, [])

        return { state, curState, memo, curMemo }
    })

    const { state, curState, memo, curMemo } = result.current
    expect(curState.current.age).toEqual(999999)
    expect(state.age).toEqual(999999)
    expect(curMemo.current.age).toEqual(999999)
    expect(memo.age).toEqual(999999)
})


test('useState压力对比测试', () => {
    const { result } = renderHook(() => {
        const [ state, setState ] = useState({ name: 'Tome', age: 0, relationship: { father: 'Jone', mother: 'Mary' } })
        const memo = useMemo(() => {
            return state
        }, [state])

        useEffect(() => {
            for(let i = 0; i < 1000000; i++){
                setState({
                    ...state,
                    age: i
                })
            }
            expect(state.age).toEqual(0)
            expect(memo.age).toEqual(0)
        }, [])
        
        return { state, memo }
    })

    const state = result.current.state
    const memo = result.current.memo

    expect(state.age).toEqual(999999)
    expect(memo.age).toEqual(999999)
})