// 纯领域类型：不依赖 React / DOM。渲染层只读这些类型。

export type Phase = 'day' | 'night';
export type SupplyKind = 'wheat'; // 初版只做小麦（初始版内容指导 §4）
export type ProductKind = 'bread' | 'record'; // 面包 / 唱片
export type PetForm = 'dog' | 'breadMachine' | 'recordPlayer'; // 狗 → 面包机 → 唱片机
export type WalkState = 'present' | 'leaving';

export interface Supply {
  id: string;
  kind: SupplyKind;
}

export interface Product {
  id: string;
  kind: ProductKind;
}

export interface Worshipper {
  id: string;
  name: string;
  supply: Supply | null; // 供奉后置空
  offered: boolean;
  walk: WalkState;
}

export interface Processing {
  input: Supply;
  startedAt: number; // ms 时间戳
  durationMs: number;
}

export interface Pet {
  form: PetForm;
  processing: Processing | null;
  output: Product | null; // 已产出、待收取
}

export interface GameState {
  phase: Phase;
  worshippers: Worshipper[];
  greenZone: Supply[]; // 已供奉、待夜晚回收的供品
  inventory: { supplies: Supply[]; products: Product[] };
  pet: Pet;
  faith: number; // 信仰值（后置占位，目前仅供奉时 +1 做可见反馈）
  seq: number; // 自增 id 计数（保持 reduce 纯函数、可重放）
  log: string[]; // 最近事件，最新在前
}

export type Action =
  | { type: 'TOGGLE_DOOR' }
  | { type: 'SPAWN_GROUP' }
  | { type: 'CLICK_WORSHIPPER'; id: string }
  | { type: 'DEPART_DONE'; id: string }
  | { type: 'PICKUP_SUPPLY'; id: string }
  | { type: 'CLICK_PET' }
  | { type: 'LOAD_MATERIAL'; supplyId: string; now: number }
  | { type: 'COLLECT_PRODUCT' }
  | { type: 'TICK'; now: number };
