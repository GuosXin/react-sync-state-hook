import type { Dispatch, SetStateAction } from 'react';
import { getImmutableCopy } from 'handleable-immutable';
/**
 * useSyncState
 * @param {*} initVal 初始化值，可以是任意类型的值
 * @returns
 */
export declare const useSyncState: <S>(initVal: S | (() => S)) => [S, Dispatch<SetStateAction<S>>, any];
/**
 * useSyncMemo
 * @param { Function } fn 计算函数
 * @param { Array } arr 受监听的状态数组
 * @returns
 */
export declare const useSyncMemo: <T>(fn: () => T, deps?: Array<any>) => any;
export declare const _getImmutableCopy_: typeof getImmutableCopy;
