import { useEffect, useReducer } from 'react';
import type { Dispatch } from 'react';
import { reduce, initialState } from '../game/engine';
import type { Action, GameState } from '../game/types';
import { TICK_MS } from '../game/constants';

// 渲染层与逻辑层之间唯一的桥：订阅 state、派发 action、驱动心跳。
export function useGame(): { state: GameState; dispatch: Dispatch<Action> } {
  const [state, dispatch] = useReducer(reduce, initialState);

  useEffect(() => {
    const t = setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), TICK_MS);
    return () => clearInterval(t);
  }, []);

  return { state, dispatch };
}
