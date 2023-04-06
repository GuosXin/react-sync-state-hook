/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import { useEffect } from 'react'
import { useSyncState, useSyncMemo } from '../public'

/**
 * useSyncState测试
 */
test('useSyncState初始化基本数据类型正常', () => {
    const { result } = renderHook(() => useSyncState(0))

    const [ state, setState ] = result.current
    expect(state).toEqual({ state: 0, current: 0 })
    expect(state.state).toEqual(0)
    expect(state.current).toEqual(0)
    expect(typeof setState).toEqual('function')
})


test('useSyncState初始化引用数据类型正常', () => {
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


test('useSyncState函数式初始化基本数据正常', () => {
    const { result } = renderHook(() => {
        const [state, setState] = useSyncState(() => {
            return 0 + 0
        })
        let computed = () => {
            return 0 + 1
        }
        const [state1, setState1] = useSyncState(() => computed())

        return { state: [state, setState], state1: [state1, setState1] }
    })

    const [ state, setState ] = result.current.state
    expect(state).toEqual({ state: 0, current: 0 })
    expect(typeof setState).toEqual('function')

    const [ state1, setState1 ] = result.current.state1
    expect(state1).toEqual({ state: 1, current: 1 })
    expect(typeof setState1).toEqual('function')
})


test('useSyncState函数式初始化引用数据正常', () => {
    const { result } = renderHook(() => {
        const [state, setState] = useSyncState(() => {
            return { name: 'Tome', hobby: ['basketball', 'music'] }
        })
        let computed = () => {
            return { name: 'Jone', hobby: ['rap', 'dancing'] }
        }
        const [state1, setState1] = useSyncState(() => computed())

        return { state: [state, setState], state1: [state1, setState1] }
    })

    const [ state, setState ] = result.current.state
    expect(state).toEqual({
        state: { name: 'Tome', hobby: ['basketball', 'music'] },
        current: { name: 'Tome', hobby: ['basketball', 'music'] }
    })
    expect(typeof setState).toEqual('function')

    const [ state1, setState1 ] = result.current.state1
    expect(state1).toEqual({
        state: { name: 'Jone', hobby: ['rap', 'dancing'] },
        current: { name: 'Jone', hobby: ['rap', 'dancing'] }
    })
    expect(typeof setState1).toEqual('function')
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


test('useSyncState在setState后，ref会实时更新，状态在下一轮渲染会更新', () => {
    interface State {
        a: any;
        [key: string]: any;
    }

    const { result } = renderHook(() => {
        const [ state, setState ] = useSyncState(0)
        const [ state1, setState1 ] = useSyncState<State>({ a: { b: 1 } })

        useEffect(() => {
            setState(1)
            expect(state.state).toEqual(0)
            expect(state.current).toEqual(1)
            
            setState1({
                ...state1.state,
                x: 1
            })
            expect(state1.state).toEqual({ a: { b: 1 } })
            expect(state1.current).toEqual({ a: { b: 1 }, x: 1 })
        }, [])

        return { state, state1 }
    })

    const state = result.current.state
    expect(state.state).toEqual(1)
    expect(state.current).toEqual(1)

    const state1 = result.current.state1
    expect(state1.state).toEqual({ a: { b: 1 }, x: 1 })
    expect(state1.current).toEqual({ a: { b: 1 }, x: 1 })

    state1.current.a.b = 2
    expect(state1.state.a.b).toEqual(1)
})


test('useSyncState通过函数式setState后，ref会实时更新，状态在下一轮渲染会更新', () => {
    const { result } = renderHook(() => {
        const [ state, setState ] = useSyncState(0)
        const [ state1, setState1 ] = useSyncState({ a: { b: 1 } })

        useEffect(() => {
            setState(prev => prev + 1)
            expect(state.state).toEqual(0)
            expect(state.current).toEqual(1)

            setState1(() => ({
                ...state1.state,
                x: 1
            }))
            expect(state1.state).toEqual({ a: { b: 1 } })
            expect(state1.current).toEqual({ a: { b: 1 }, x: 1 })
        }, [])

        return { state, state1 }
    })

    const state = result.current.state
    expect(state.state).toEqual(1)
    expect(state.current).toEqual(1)

    const state1 = result.current.state1
    expect(state1.state).toEqual({ a: { b: 1 }, x: 1 })
    expect(state1.current).toEqual({ a: { b: 1 }, x: 1 })

    state1.current.a.b = 2
    expect(state1.state.a.b).toEqual(1)
})

test('----------------------------------', () => {})

/**
 * useSyncMemo测试
 */
test('useSyncMemo初始化一个依赖项正常', () => {
    renderHook(() => {
        const [ state, setState ] = useSyncState(0)
        const memo = useSyncMemo(() => {
            return state.current + 1
        }, [state])

        useEffect(() => {
            expect(state).toEqual({ state: 0, current: 0 })
            expect(state.state).toEqual(0)
            expect(state.current).toEqual(0)
            expect(typeof setState).toEqual('function')

            expect(memo).toEqual({state: 1, current: 1})
            expect(memo.state).toEqual(1)
            expect(memo.current).toEqual(1)
        }, [])
    })
})


test('useSyncMemo初始化多个依赖项正常', () => {
    renderHook(() => {
        const [ state, setState ] = useSyncState(0)
        const [ state1, setState1 ] = useSyncState(1)
        const [ state2, setState2 ] = useSyncState(2)
        const memo = useSyncMemo(() => {
            return state.current + state1.current + state2.current
        }, [state, state1, state2])

        useEffect(() => {
            expect(state).toEqual({ state: 0, current: 0 })
            expect(state.state).toEqual(0)
            expect(state.current).toEqual(0)
            expect(typeof setState).toEqual('function')

            expect(state1).toEqual({ state: 1, current: 1 })
            expect(state1.state).toEqual(1)
            expect(state1.current).toEqual(1)
            expect(typeof setState1).toEqual('function')

            expect(state2).toEqual({ state: 2, current: 2 })
            expect(state2.state).toEqual(2)
            expect(state2.current).toEqual(2)
            expect(typeof setState2).toEqual('function')

            expect(memo).toEqual({state: 3, current: 3})
            expect(memo.state).toEqual(3)
            expect(memo.current).toEqual(3)
        }, [])
    })
})


test('useSyncMemo有一个依赖项时，状态和ref为深拷贝', () => {
    renderHook(() => {
        const [ state, setState ] = useSyncState({ name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } })
        const memo = useSyncMemo(() => {
            return { admin: state.current }
        }, [state])

        useEffect(() => {
            expect(Object.is(state.state, state.current)).toEqual(false)
            expect(Object.is(memo.state, memo.current)).toEqual(false)

            memo.current.admin.name = 'Jack'
            memo.current.admin.relationship.father = 'Peter'
            expect(memo.current).toEqual({ admin: { name: 'Jack', relationship: { father: 'Peter', mother: 'Mary' } } })
            expect(memo.state).toEqual({ admin: { name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } } })
        }, [])
    })
})


test('useSyncMemo有多个依赖项时，状态和ref为深拷贝', () => {
    renderHook(() => {
        const [ state, setState ] = useSyncState({ name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } })
        const [ state1, setState1 ] = useSyncState({ name: 'Ross', relationship: { father: 'Jone', mother: 'Mary' } })
        const [ state2, setState2 ] = useSyncState({ name: 'Jack', relationship: { father: 'Jone', mother: 'Mary' } })
        const memo = useSyncMemo(() => {
            return { admin: state.current, visitor: [state1.current, state2.current] }
        }, [state, state1, state2])

        useEffect(() => {
            expect(Object.is(state.state, state.current)).toEqual(false)
            expect(Object.is(state1.state, state1.current)).toEqual(false)
            expect(Object.is(state2.state, state2.current)).toEqual(false)
            expect(Object.is(memo.state, memo.current)).toEqual(false)

            memo.current.admin.name = 'Henry'
            memo.current.visitor[0].name = 'Peter'
            expect(memo.current).toEqual({
                admin: { name: 'Henry', relationship: { father: 'Jone', mother: 'Mary' } },
                visitor: [
                    { name: 'Peter', relationship: { father: 'Jone', mother: 'Mary' } },
                    { name: 'Jack', relationship: { father: 'Jone', mother: 'Mary' } }
                ]
            })
            expect(memo.state).toEqual({
                admin: { name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } },
                visitor: [
                    { name: 'Ross', relationship: { father: 'Jone', mother: 'Mary' } },
                    { name: 'Jack', relationship: { father: 'Jone', mother: 'Mary' } }
                ]
            })
        }, [])
    })
})


test('有一个依赖项的useSyncMemo在setState后，ref会实时更新，状态在下一轮渲染会更新', () => {
    const { result } = renderHook(() => {
        const [ state, setState ] = useSyncState(0)
        const memo = useSyncMemo(() => {
            return state.current + 1
        }, [state])

        useEffect(() => {
            setState(1)
            expect(state).toEqual({ state: 0, current: 1 })
            expect(memo).toEqual({ state: 1, current: 2 })
        }, [])

        return { state, memo }
    })

    const { state, memo } = result.current
    expect(state).toEqual({ state: 1, current: 1 })
    expect(memo).toEqual({ state: 2, current: 2 })
})


test('有多个依赖项的useSyncMemo在setState后，ref会实时更新，状态在下一轮渲染会更新', () => {
    const { result } = renderHook(() => {
        const [ state, setState ] = useSyncState(0)
        const [ state1, setState1 ] = useSyncState(() => 0)
        const memo = useSyncMemo(() => {
            return state.current + state1.current
        }, [state, state1])

        useEffect(() => {
            setState(() => 1)
            setState1(2)
            expect(state).toEqual({ state: 0, current: 1 })
            expect(state1).toEqual({ state: 0, current: 2 })
            expect(memo).toEqual({ state: 0, current: 3 })
        }, [])

        return { state, state1, memo }
    })

    const { state, state1, memo } = result.current
    expect(state).toEqual({ state: 1, current: 1 })
    expect(state1).toEqual({ state: 2, current: 2 })
    expect(memo).toEqual({ state: 3, current: 3 })
})
