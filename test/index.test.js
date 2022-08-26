import { renderHook, act } from '@testing-library/react-hooks'
import useSyncState from '../index'

test('常规测试', () => {
    const { result } = renderHook(() => useSyncState('初始值'))
    const [ asyncState, setState, syncState ] = result.current
    
    act(() =>{
        setState('当前值')
    })

    expect(asyncState).toBe('初始值')
    expect(syncState.value).toBe('当前值')
})

test('循环测试', () => {
    const { result } = renderHook(() => useSyncState('初始值'))

    act(() =>{
        const [ asyncState, setState, syncState ] = result.current
        for(let i = 0; i < 10; i++){
            setState(i)
            expect(asyncState).toBe('初始值')
            expect(syncState.value).toBe(i)
        }
    })

    expect(result.current[0]).toBe(9)
})