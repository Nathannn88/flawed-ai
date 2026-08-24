// 纯状态机：reduce(state, action) => state。无副作用、无 React/DOM。
// 这是核心循环的"真资产"——渲染层可随意替换（2D 占位 / 3D / 预渲染片段），本文件不动。

import type { GameState, Action, Worshipper, Product, PetForm } from './types';
import { PROCESS_MS, GROUP_SIZE, WORSHIPPER_NAMES } from './constants';

export const initialState: GameState = {
  phase: 'day',
  worshippers: [],
  greenZone: [],
  inventory: { supplies: [], products: [] },
  pet: { form: 'dog', processing: null, output: null },
  faith: 0,
  seq: 1,
  log: ['☀️ 白天·开门——点击「召集信众」，看看谁来上供。'],
};

export function formName(f: PetForm): string {
  return f === 'dog' ? '小狗' : f === 'breadMachine' ? '面包机' : '唱片机';
}

const PET_CYCLE: PetForm[] = ['dog', 'breadMachine', 'recordPlayer'];

function note(state: GameState, msg: string): string[] {
  return [msg, ...state.log].slice(0, 6);
}

export function reduce(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'TOGGLE_DOOR': {
      const phase = state.phase === 'day' ? 'night' : 'day';
      if (phase === 'night') {
        return { ...state, phase, log: note(state, '🌙 关门·入夜——神像化为灵体，宠物现身。从「待回收」拾取供品。') };
      }
      // 回到白天：清场、宠物归位
      return {
        ...state,
        phase,
        worshippers: [],
        pet: { ...state.pet, form: 'dog' },
        log: note(state, '☀️ 开门·天明——新的一天，召集信众。'),
      };
    }

    case 'SPAWN_GROUP': {
      if (state.phase !== 'day') return state;
      let seq = state.seq;
      const group: Worshipper[] = [];
      for (let i = 0; i < GROUP_SIZE; i++) {
        group.push({
          id: `w${seq}`,
          name: WORSHIPPER_NAMES[(seq - 1) % WORSHIPPER_NAMES.length],
          supply: { id: `s${seq}`, kind: 'wheat' },
          offered: false,
          walk: 'present',
        });
        seq++;
      }
      return { ...state, seq, worshippers: [...state.worshippers, ...group], log: note(state, `一组信众（${group.length} 人）走进庙中。`) };
    }

    case 'CLICK_WORSHIPPER': {
      const w = state.worshippers.find((x) => x.id === action.id);
      if (!w || w.offered || w.walk !== 'present' || !w.supply) return state;
      return {
        ...state,
        greenZone: [...state.greenZone, w.supply],
        worshippers: state.worshippers.map((x) =>
          x.id === w.id ? { ...x, supply: null, offered: true, walk: 'leaving' } : x,
        ),
        faith: state.faith + 1,
        log: note(state, `${w.name} 供奉了一捆小麦。`),
      };
    }

    case 'DEPART_DONE': {
      return { ...state, worshippers: state.worshippers.filter((x) => x.id !== action.id) };
    }

    case 'PICKUP_SUPPLY': {
      if (state.phase !== 'night') return state;
      const s = state.greenZone.find((x) => x.id === action.id);
      if (!s) return state;
      return {
        ...state,
        greenZone: state.greenZone.filter((x) => x.id !== s.id),
        inventory: { ...state.inventory, supplies: [...state.inventory.supplies, s] },
        log: note(state, '拾取一捆小麦到物品栏。'),
      };
    }

    case 'CLICK_PET': {
      if (state.phase !== 'night') return state;
      if (state.pet.processing) return state; // 加工中不变形
      const next = PET_CYCLE[(PET_CYCLE.indexOf(state.pet.form) + 1) % PET_CYCLE.length];
      return { ...state, pet: { ...state.pet, form: next }, log: note(state, `宠物变形为${formName(next)}。`) };
    }

    case 'LOAD_MATERIAL': {
      if (state.phase !== 'night' || state.pet.form !== 'breadMachine' || state.pet.processing || state.pet.output) return state;
      const s = state.inventory.supplies.find((x) => x.id === action.supplyId);
      if (!s) return state;
      return {
        ...state,
        inventory: { ...state.inventory, supplies: state.inventory.supplies.filter((x) => x.id !== s.id) },
        pet: { ...state.pet, processing: { input: s, startedAt: action.now, durationMs: PROCESS_MS } },
        log: note(state, '投入小麦，面包机开始加工…'),
      };
    }

    case 'COLLECT_PRODUCT': {
      if (!state.pet.output) return state;
      return {
        ...state,
        inventory: { ...state.inventory, products: [...state.inventory.products, state.pet.output] },
        pet: { ...state.pet, output: null },
        log: note(state, '收取成品。点宠物变唱片机即可播放。'),
      };
    }

    case 'TICK': {
      const p = state.pet.processing;
      if (p && action.now - p.startedAt >= p.durationMs) {
        const product: Product = { id: `p${state.seq}`, kind: 'bread' };
        return {
          ...state,
          seq: state.seq + 1,
          pet: { ...state.pet, processing: null, output: product },
          log: note(state, '🍞 成品出炉：一个面包！点「收取」放入物品栏。'),
        };
      }
      return state;
    }

    default:
      return state;
  }
}
