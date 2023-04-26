/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import { useEffect } from 'react'
import { useSyncState, useSyncMemo, _getImmutableCopy_ } from '../public'
import { createImmutable } from 'handleable-immutable'

/**
 * useSyncState测试
 */
test('useSyncState初始化基本数据类型正常', () => {
    const { result } = renderHook(() => useSyncState(0))

    const [ state, setState, curState ] = result.current
    expect(state).toEqual(0)
    expect(curState.current).toEqual(0)
    expect(typeof setState).toEqual('function')
})


test('useSyncState初始化引用数据类型正常', () => {
    const { result } = renderHook(() => useSyncState({ name: 'Tome', hobby: ['basketball', 'music'] }))

    const [ state, setState, curState ] = result.current
    expect(state).toEqual({ name: 'Tome', hobby: ['basketball', 'music'] })
    expect(curState.current).toEqual(createImmutable({ name: 'Tome', hobby: ['basketball', 'music'] }))
    expect(typeof setState).toEqual('function')
})


test('useSyncState函数式初始化基本数据正常', () => {
    const { result } = renderHook(() => {
        const [state, setState, curState] = useSyncState(() => {
            return 1014 + 10
        })
        let computed = () => {
            return 100 + 1
        }
        const [state1, setState1, curState1] = useSyncState(() => computed())

        expect(state).toEqual(1024)
        expect(curState.current).toEqual(1024)
        expect(typeof setState).toEqual('function')

        expect(state1).toEqual(101)
        expect(curState1.current).toEqual(101)
        expect(typeof setState1).toEqual('function')
    })
})


test('useSyncState函数式初始化引用数据正常', () => {
    const { result } = renderHook(() => {
        const [state, setState, curState] = useSyncState(() => {
            return { name: 'Tome', hobby: ['basketball', 'music'] }
        })
        let computed = () => {
            return { name: 'Jone', hobby: ['rap', 'dancing'] }
        }
        const [state1, setState1, curState1] = useSyncState(() => computed())

        expect(state).toEqual({ name: 'Tome', hobby: ['basketball', 'music'] })
        expect(curState.current).toEqual(createImmutable({ name: 'Tome', hobby: ['basketball', 'music'] }))
        expect(typeof setState).toEqual('function')

        expect(state1).toEqual({ name: 'Jone', hobby: ['rap', 'dancing'] })
        expect(curState1.current).toEqual(createImmutable({ name: 'Jone', hobby: ['rap', 'dancing'] }))
        expect(typeof setState1).toEqual('function')
    })
})


test('useSyncState的current变更不会影响到state', () => {
    const { result } = renderHook(() => useSyncState({ name: 'Tome', hobby: ['basketball', 'music'] }))
    const [ state, setState, curState ] = result.current
    expect(Object.is(state, curState.current)).toEqual(false)

    curState.current.name = 'Jone'
    curState.current.hobby[1] = 'dancing'
    expect(_getImmutableCopy_(curState.current)).toEqual({ name: 'Jone', hobby: ['basketball', 'dancing'] })
    expect(state).toEqual({ name: 'Tome', hobby: ['basketball', 'music'] })
})


test('useSyncState在setState后，current会实时更新，状态在下一轮渲染会更新', () => {
    const { result } = renderHook(() => {
        const [ state, setState, curState ] = useSyncState(0)
        const [ state1, setState1, curState1 ] = useSyncState<any>({ a: { b: 1 } })

        useEffect(() => {
            setState(1)
            setState1({
                ...state1,
                x: 1
            })

            expect(state).toEqual(0)
            expect(curState.current).toEqual(1)
            expect(state1).toEqual({ a: { b: 1 } })
            expect(_getImmutableCopy_(curState1.current)).toEqual({ a: { b: 1 }, x: 1 })
        }, [])

        return { state, curState, state1, curState1 }
    })

    const { state, curState, state1, curState1 } = result.current
    expect(state).toEqual(1)
    expect(curState.current).toEqual(1)

    expect(state1).toEqual({ a: { b: 1 }, x: 1 })
    expect(_getImmutableCopy_(curState1.current)).toEqual({ a: { b: 1 }, x: 1 })

    curState1.current.a.b = 2
    expect(state1.a.b).toEqual(1)
})


test('useSyncState通过函数式setState后，current会实时更新，状态在下一轮渲染会更新', () => {
    const { result } = renderHook(() => {
        const [ state, setState, curState ] = useSyncState(0)
        const [ state1, setState1, curState1 ] = useSyncState({ a: { b: 1 } })

        useEffect(() => {
            setState(prev => prev + 1)
            expect(state).toEqual(0)
            expect(curState.current).toEqual(1)

            setState1(() => ({
                ...state1,
                x: 1
            }))
            expect(state1).toEqual({ a: { b: 1 } })
            expect(_getImmutableCopy_(curState1.current)).toEqual({ a: { b: 1 }, x: 1 })
        }, [])

        return { state, curState, state1, curState1 }
    })

    const { state, curState, state1, curState1 } = result.current
    expect(state).toEqual(1)
    expect(curState.current).toEqual(1)

    expect(state1).toEqual({ a: { b: 1 }, x: 1 })
    expect(_getImmutableCopy_(curState1.current)).toEqual({ a: { b: 1 }, x: 1 })

    curState1.current.a.b = 2
    expect(state1.a.b).toEqual(1)
})


test('useSyncState通过current和函数式的prev更新后数据会自动解包', () => {
    const { result } = renderHook(() => {
        const [ state, setState, curState ] = useSyncState<any>([{x: 1}])
        const [ state1, setState1, curState1 ] = useSyncState([{ a: { b: 1 } }])

        useEffect(() => {
            setState(prev => {
                prev.push({y: 2})
                return prev
            })
            curState1.current[0].x = 1
            setState1(curState1.current)
        }, [])

        return { state, curState, state1, curState1 }
    })

    const { state, curState, state1, curState1 } = result.current
    expect(state).toEqual([{x: 1}, {y: 2}])
    expect(curState.current).toEqual(createImmutable([{x: 1}, {y: 2}]))

    expect(state1).toEqual([{ a: { b: 1 }, x: 1 }])
    expect(curState1.current).toEqual(createImmutable([{ a: { b: 1 }, x: 1 }]))
})

test('----------------------------------', () => {})

/**
 * useSyncMemo测试
 */
test('useSyncMemo初始化一个依赖项正常', () => {
    renderHook(() => {
        const [ state, setState, curState ] = useSyncState(0)
        const [memo, curMemo] = useSyncMemo(() => {
            return curState.current + 1
        }, [curState])

        useEffect(() => {
            expect(state).toEqual(0)
            expect(curState.current).toEqual(0)
            expect(typeof setState).toEqual('function')

            expect(memo).toEqual(1)
            expect(curMemo.current).toEqual(1)
        }, [])
    })
})


test('useSyncMemo初始化多个依赖项正常', () => {
    renderHook(() => {
        const [ state, setState, curState ] = useSyncState(0)
        const [ state1, setState1, curState1 ] = useSyncState(1)
        const [ state2, setState2, curState2 ] = useSyncState(2)
        const [memo, curMemo] = useSyncMemo(() => {
            return curState.current + curState1.current + curState2.current
        }, [curState, curState1, curState2])

        useEffect(() => {
            expect(state).toEqual(0)
            expect(curState.current).toEqual(0)
            expect(typeof setState).toEqual('function')

            expect(state1).toEqual(1)
            expect(curState1.current).toEqual(1)
            expect(typeof setState1).toEqual('function')

            expect(state2).toEqual(2)
            expect(curState2.current).toEqual(2)
            expect(typeof setState2).toEqual('function')

            expect(memo).toEqual(3)
            expect(curMemo.current).toEqual(3)
        }, [])
    })
})


test('useSyncMemo初始化无依赖项正常', () => {
    renderHook(() => {
        const [ state, setState, curState ] = useSyncState(0)
        const [ state1, setState1, curState1 ] = useSyncState(1)
        const [ state2, setState2, curState2 ] = useSyncState(2)
        const [memo, curMemo] = useSyncMemo(() => {
            return curState.current + curState1.current + curState2.current
        })

        useEffect(() => {
            expect(state).toEqual(0)
            expect(curState.current).toEqual(0)
            expect(typeof setState).toEqual('function')

            expect(state1).toEqual(1)
            expect(curState1.current).toEqual(1)
            expect(typeof setState1).toEqual('function')

            expect(state2).toEqual(2)
            expect(curState2.current).toEqual(2)
            expect(typeof setState2).toEqual('function')

            expect(memo).toEqual(3)
            expect(curMemo.current).toEqual(3)
        }, [])
    })
})


test('useSyncMemo无依赖项时，会从函数中的状态自动获取依赖，更改状态current时只会更改curMemo', () => {
    const { result } = renderHook(() => {
        const [ state, setState, curState ] = useSyncState(0)
        const [ state1, setState1, curState1 ] = useSyncState(1)
        const [ state2, setState2, curState2 ] = useSyncState(2)
        const [ state3, setState3, curState3 ] = useSyncState(3)
        const [ memo, curMemo ] = useSyncMemo(() => {
            return curState.current + curState1.current
        })
        const [ memo1, curMemo1 ] = useSyncMemo(() => {
            return curState2.current + curState3.current
        })

        useEffect(() => {
            setState(10)
            expect(memo).toEqual(1)
            expect(curMemo.current).toEqual(11)

            setState1(20)
            expect(memo).toEqual(1)
            expect(curMemo.current).toEqual(30)

            curState2.current = 10
            expect(memo1).toEqual(5)
            expect(curMemo1.current).toEqual(13)

            setState3(20)
            expect(memo1).toEqual(5)
            expect(curMemo1.current).toEqual(30)
        }, [])

        return { memo, curMemo, memo1, curMemo1 }
    })

    const { memo, curMemo, memo1, curMemo1 } = result.current
    
    expect(memo).toEqual(30)
    expect(curMemo.current).toEqual(30)

    expect(memo1).toEqual(22)
    expect(curMemo1.current).toEqual(22)
})


test('useSyncMemo有一个依赖项时，current变更不会影响到memo', () => {
    renderHook(() => {
        const [ state, setState, curState ] = useSyncState({ name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } })
        const [memo, curMemo] = useSyncMemo(() => {
            return { admin: _getImmutableCopy_(curState.current) }
        }, [curState])

        useEffect(() => {
            expect(Object.is(state, curState.current)).toEqual(false)
            expect(Object.is(memo, curMemo.current)).toEqual(false)
            
            curMemo.current.admin.name = 'Jack'
            curMemo.current.admin.relationship.father = 'Peter'
            expect(_getImmutableCopy_(curMemo.current)).toEqual({ admin: { name: 'Jack', relationship: { father: 'Peter', mother: 'Mary' } } })
            expect(memo).toEqual({ admin: { name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } } })
        }, [])
    })
})


test('useSyncMemo有多个依赖项时，current变更不会影响到memo', () => {
    renderHook(() => {
        const [ state, setState, curState ] = useSyncState({ name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } })
        const [ state1, setState1, curState1 ] = useSyncState({ name: 'Ross', relationship: { father: 'Jone', mother: 'Mary' } })
        const [ state2, setState2, curState2 ] = useSyncState({ name: 'Jack', relationship: { father: 'Jone', mother: 'Mary' } })
        const [ memo, curMemo ] = useSyncMemo(() => {
            return { admin: _getImmutableCopy_(curState.current), visitor: [_getImmutableCopy_(curState1.current), _getImmutableCopy_(curState2.current)] }
        }, [curState, curState1, curState2])

        useEffect(() => {
            expect(Object.is(state, curState.current)).toEqual(false)
            expect(Object.is(state1, curState1.current)).toEqual(false)
            expect(Object.is(state2, curState2.current)).toEqual(false)
            expect(Object.is(memo, curMemo.current)).toEqual(false)

            curMemo.current.admin.name = 'Henry'
            curMemo.current.visitor[0].name = 'Peter'
            expect(_getImmutableCopy_(curMemo.current)).toEqual({
                admin: { name: 'Henry', relationship: { father: 'Jone', mother: 'Mary' } },
                visitor: [
                    { name: 'Peter', relationship: { father: 'Jone', mother: 'Mary' } },
                    { name: 'Jack', relationship: { father: 'Jone', mother: 'Mary' } }
                ]
            })
            expect(memo).toEqual({
                admin: { name: 'Tome', relationship: { father: 'Jone', mother: 'Mary' } },
                visitor: [
                    { name: 'Ross', relationship: { father: 'Jone', mother: 'Mary' } },
                    { name: 'Jack', relationship: { father: 'Jone', mother: 'Mary' } }
                ]
            })
        }, [])
    })
})


test('有一个依赖项的useSyncMemo在setState后，current会实时更新，memo在下一轮渲染会更新', () => {
    const { result } = renderHook(() => {
        const [ state, setState, curState ] = useSyncState(0)
        const [ memo, curMemo ] = useSyncMemo(() => {
            return curState.current + 1
        }, [curState])

        useEffect(() => {
            setState(1)
            expect(state).toEqual(0)
            expect(curState.current).toEqual(1)
            expect(memo).toEqual(1)
            expect(curMemo.current).toEqual(2)
        }, [])

        return { state, curState, memo, curMemo }
    })

    const { state, curState, memo, curMemo } = result.current
    expect(state).toEqual(1)
    expect(curState.current).toEqual(1)
    expect(memo).toEqual(2)
    expect(curMemo.current).toEqual(2)
})


test('有多个依赖项的useSyncMemo在setState后，current会实时更新，memo在下一轮渲染会更新', () => {
    const { result } = renderHook(() => {
        const [ state, setState, curState ] = useSyncState(0)
        const [ state1, setState1, curState1 ] = useSyncState(() => 0)
        const [ memo, curMemo ] = useSyncMemo(() => {
            return curState.current + curState1.current
        }, [curState, curState1])

        useEffect(() => {
            setState(() => 1)
            setState1(2)
            expect(state).toEqual(0)
            expect(curState.current).toEqual(1)
            expect(state1).toEqual(0)
            expect(curState1.current).toEqual(2)
            expect(memo).toEqual(0)
            expect(curMemo.current).toEqual(3)
        }, [])

        return { state, curState, state1, curState1, memo, curMemo }
    })

    const { state, curState, state1, curState1, memo, curMemo } = result.current
    expect(state).toEqual(1)
    expect(curState.current).toEqual(1)
    expect(state1).toEqual(2)
    expect(curState1.current).toEqual(2)
    expect(memo).toEqual(3)
    expect(curMemo.current).toEqual(3)
})
