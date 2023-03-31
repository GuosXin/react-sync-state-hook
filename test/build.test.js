/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useSyncState, useSyncMemo } from '../public'


test('useSyncState初始化基本数据类型', () => {
    const { result } = renderHook(() => useSyncState(0))

    const [ state, setState ] = result.current
    expect(state).toEqual({ state: 0, current: 0 })
    expect(state.state).toEqual(0)
    expect(state.current).toEqual(0)
    expect(typeof setState).toEqual('function')
})


test('useSyncState初始化引用数据类型', () => {
    const { result } = renderHook(() => useSyncState({ name: 'Tome', hobby: ['basketball', 'music'] }))

    const [ state, setState ] = result.current
    expect(state).toEqual({
        state: { name: 'Tome', hobby: ['basketball', 'music'] },
        current: { name: 'Tome', hobby: ['basketball', 'music'] }
    })
    expect(state.state).toEqual({ name: 'Tome', hobby: ['basketball', 'music'] })
    expect(state.current).toEqual({ name: 'Tome', hobby: ['basketball', 'music'] })
    expect(typeof setState).toEqual('function')
})


test('useSyncMemo初始化功能', () => {
    const { result } = renderHook(() => {
        const [ state, setState ] = useSyncState(0)
        const memo = useSyncMemo(() => {
            return state.current + 1
        }, [state])
        return { state: [ state, setState ], memo }
    })

    const [ state, setState ] = result.current.state
    expect(state).toEqual({ state: 0, current: 0 })
    expect(state.state).toEqual(0)
    expect(state.current).toEqual(0)
    expect(typeof setState).toEqual('function')

    const memo = result.current.memo
    expect(memo).toEqual({state: 1, current: 1})
    expect(memo.state).toEqual(1)
    expect(memo.current).toEqual(1)
})


test('useSyncState的状态和ref为深拷贝', () => {
    const { result } = renderHook(() => useSyncState({ name: 'Tome', hobby: ['basketball', 'music'] }))
    const [ state, setState ] = result.current
    expect(Object.is(state.state, state.current)).toEqual(false)

    state.current.name = 'Jone'
    state.current.hobby[1] = 'dancing'
    expect(state.current).toEqual({ name: 'Jone', hobby: ['basketball', 'dancing'] })
    expect(state.state).toEqual({ name: 'Tome', hobby: ['basketball', 'music'] })
})


test('useSyncMemo的状态和ref为深拷贝', () => {
    const { result } = renderHook(() => {
        const [ state, setState ] = useSyncState({ name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } })
        const memo = useSyncMemo(() => {
            return state.current
        }, [state])
        return { state: [ state, setState ], memo }
    })

    const [ state, setState ] = result.current.state
    expect(Object.is(state.state, state.current)).toEqual(false)

    const memo = result.current.memo
    expect(Object.is(memo.state, memo.current)).toEqual(false)
})


test('setState时ref实时更新', () => {
    const { result, rerender } = renderHook(() => useSyncState(0))
    const [ state, setState ] = result.current
    
    act(() => {
        setState(1)
        expect(state.state).toEqual(0)
        expect(state.current).toEqual(1)
    })

    rerender()

    expect(state.state).toEqual(1)
    expect(state.current).toEqual(1)
})
