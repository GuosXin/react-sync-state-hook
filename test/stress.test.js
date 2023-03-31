/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import { useSyncState, useSyncMemo } from '../src'
import { useState, useMemo, useEffect } from 'react'

test('useState压力对比测试', () => {
    const { result } = renderHook(() => {
        const [ state, setState ] = useState({ name: 'Tome', age: 0, relationship: { father: 'Jone', mother: 'Mary' } })
        const memo = useMemo(() => {
            return state
        }, [state])

        useEffect(() => {
            for(let i = 0; i < 10000000; i++){
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


test('useSyncState压力对比测试', () => {
    const { result } = renderHook(() => {
        const [ state, setState ] = useSyncState({ name: 'Tome', age: 0, relationship: { father: 'Jone', mother: 'Mary' } })
        const memo = useSyncMemo(() => {
            return state.current
        }, [state])

        useEffect(() => {
            for(let i = 0; i < 10000000; i++){
                state.current.age = i
                setState(state.current)
            }
            expect(state.current.age).toEqual(999999)
            expect(state.state.age).toEqual(0)
            expect(memo.current.age).toEqual(999999)
            expect(memo.state.age).toEqual(0)
        }, [])

        return { state, memo }
    })

    const state = result.current.state
    const memo = result.current.memo
    expect(state.current.age).toEqual(999999)
    expect(state.state.age).toEqual(999999)
    expect(memo.current.age).toEqual(999999)
    expect(memo.state.age).toEqual(999999)
})