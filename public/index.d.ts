import type { Dispatch, SetStateAction } from 'react';
interface SyncState<S> {
    state: S;
    current: S;
}
type SyncDependencyList = SyncState<any>[];
/**
 * useSyncState
 * @param {*} initVal 初始化值，可以是任意类型的值
 * @returns
 */
export declare const useSyncState: <S>(initVal: S | (() => S)) => [SyncState<S>, Dispatch<SetStateAction<S>>];
/**
 * useSyncMemo
 * @param { Function } fn 计算函数
 * @param { Array } arr 受监听的状态数组
 * @returns
 */
export declare const useSyncMemo: <T>(fn: () => T, arr: SyncDependencyList) => SyncState<T>;
export {};
