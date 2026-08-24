const test = require('node:test');
const assert = require('node:assert/strict');

const {
  CONFIG,
  awardDialogueEnergy,
  resonateMemory,
  selectArtwork,
  finalizeResonance,
  assignShowcaseSlot,
} = require('../game-rules.js');
const { ARTWORKS } = require('../content-catalog.js');

function material(id, materialId) {
  return { id, kind: 'material', materialId };
}

test('非空回应获得一点记忆能量，空白回应不奖励', () => {
  assert.deepEqual(awardDialogueEnergy(0, '我觉得重复会产生一种安心感。'), {
    energy: 1,
    gained: 1,
  });
  assert.deepEqual(awardDialogueEnergy(2, '   '), {
    energy: 2,
    gained: 0,
  });
  assert.equal(CONFIG.dialogueEnergyReward, 1);
});

test('少于两件材料时拒绝共鸣，资源保持不变', () => {
  const inventory = [material('item-1', 'wheat-bread')];
  const result = resonateMemory({
    energy: 2,
    inventory,
    selectedMaterialIds: ['item-1'],
    resultId: 'result-1',
    roll: 0.1,
  });

  assert.equal(result.ok, false);
  assert.equal(result.code, 'NEED_TWO_MATERIALS');
  assert.equal(result.energy, 2);
  assert.deepEqual(result.inventory, inventory);
  assert.notEqual(result.inventory, inventory);
});

test('能量不足时拒绝共鸣，不误扣两件材料', () => {
  const inventory = [
    material('item-1', 'wheat-bread'),
    material('item-2', 'echo-shell'),
  ];
  const result = resonateMemory({
    energy: 0,
    inventory,
    selectedMaterialIds: ['item-1', 'item-2'],
    resultId: 'result-1',
    roll: 0.1,
  });

  assert.equal(result.ok, false);
  assert.equal(result.code, 'NO_ENERGY');
  assert.equal(result.energy, 0);
  assert.deepEqual(result.inventory, inventory);
});

test('配方边界 roll === 0.2 进入常规分支，原子消耗两材料与一点能量', () => {
  const first = material('item-1', 'wheat-bread');
  const second = material('item-2', 'echo-shell');
  const untouched = material('item-3', 'mirror-salt');
  const inventory = [first, second, untouched];

  const result = resonateMemory({
    energy: 3,
    inventory,
    selectedMaterialIds: [first.id, second.id],
    resultId: 'result-7',
    roll: 0.2,
    artworkId: ARTWORKS[0].id,
  });

  assert.equal(result.ok, true);
  assert.equal(result.code, 'OK');
  assert.equal(result.energy, 2);
  assert.deepEqual(result.inventory, [untouched]);
  assert.equal(result.resonanceResult.rarity, 'common');
  assert.equal(result.resonanceResult.carrierId, 'carrier-unnamed-memory-box');
  assert.equal(result.resonanceResult.artworkId, ARTWORKS[0].id);
  assert.deepEqual(result.resonanceResult.sourceMaterials, [first, second]);
  assert.deepEqual(result.resonanceResult.materialIds, ['wheat-bread', 'echo-shell']);
  assert.deepEqual(result.resonanceResult, {
    ...result.resonanceResult,
    id: 'result-7',
    kind: 'resonance-result',
    status: 'pending',
    displaySlot: null,
  });
  assert.equal(inventory.length, 3, '纯规则不得原地修改输入物品栏');
});

test('命中配方且 roll < 0.2 时生成对应奇珍，仍然绑定艺术品', () => {
  const inventory = [
    material('item-1', 'wheat-bread'),
    material('item-2', 'echo-shell'),
  ];
  const result = resonateMemory({
    energy: 2,
    inventory,
    selectedMaterialIds: ['item-2', 'item-1'],
    resultId: 'result-relic',
    roll: 0.199999,
    artworkId: ARTWORKS[4].id,
  });

  assert.equal(result.ok, true);
  assert.equal(result.resonanceResult.rarity, 'formula-relic');
  assert.equal(result.resonanceResult.carrierId, 'carrier-bread-record');
  assert.equal(result.resonanceResult.artworkId, ARTWORKS[4].id);
  assert.equal(result.resonanceResult.islandId, 'performance');
});

test('未命中配方时即使 roll 很低也稳定生成常规载体', () => {
  const result = resonateMemory({
    energy: 1,
    inventory: [
      material('item-1', 'wheat-bread'),
      material('item-2', 'mirror-salt'),
    ],
    selectedMaterialIds: ['item-1', 'item-2'],
    resultId: 'result-common',
    roll: 0,
    artworkId: ARTWORKS[1].id,
  });

  assert.equal(result.ok, true);
  assert.equal(result.resonanceResult.rarity, 'common');
  assert.equal(result.resonanceResult.carrierId, 'carrier-unnamed-memory-box');
  assert.equal(result.resonanceResult.recipeId, null);
});

test('艺术抽取优先尚未见过的作品', () => {
  const selected = selectArtwork({
    artworks: ARTWORKS,
    seenArtworkIds: ARTWORKS.slice(0, 11).map(item => item.id),
    roll: 0,
  });
  assert.equal(selected.id, ARTWORKS[11].id);
});

test('左向归还恢复原材料但不返能量，并且同一结果只能 finalize 一次', () => {
  const sourceMaterials = [
    material('item-1', 'wheat-bread'),
    material('item-2', 'echo-shell'),
  ];
  const pending = {
    id: 'result-1',
    kind: 'resonance-result',
    status: 'pending',
    sourceMaterials,
    materialIds: sourceMaterials.map(item => item.materialId),
    artworkId: ARTWORKS[0].id,
    displaySlot: null,
  };

  const returned = finalizeResonance({
    resonanceResult: pending,
    decision: 'return',
    energy: 4,
    inventory: [],
    memoryItems: [],
  });

  assert.equal(returned.ok, true);
  assert.equal(returned.energy, 4);
  assert.deepEqual(returned.inventory, sourceMaterials);
  assert.deepEqual(returned.memoryItems, []);
  assert.equal(returned.resonanceResult.status, 'returned');

  const repeated = finalizeResonance({
    resonanceResult: returned.resonanceResult,
    decision: 'return',
    energy: returned.energy,
    inventory: returned.inventory,
    memoryItems: returned.memoryItems,
  });
  assert.equal(repeated.ok, false);
  assert.equal(repeated.code, 'ALREADY_FINALIZED');
  assert.deepEqual(repeated.inventory, sourceMaterials);
});

test('右向珍藏完整写入记忆空间且不返材料', () => {
  const pending = {
    id: 'result-2',
    kind: 'resonance-result',
    status: 'pending',
    sourceMaterials: [
      material('item-1', 'iris-berry'),
      material('item-2', 'mirror-salt'),
    ],
    materialIds: ['iris-berry', 'mirror-salt'],
    artworkId: ARTWORKS[2].id,
    carrierId: 'carrier-kaleidoscope-fruit',
    rarity: 'formula-relic',
    displaySlot: null,
  };

  const kept = finalizeResonance({
    resonanceResult: pending,
    decision: 'keep',
    energy: 1,
    inventory: [],
    memoryItems: [],
    memoryItemId: 'memory-1',
  });

  assert.equal(kept.ok, true);
  assert.deepEqual(kept.inventory, []);
  assert.equal(kept.memoryItems.length, 1);
  assert.equal(kept.memoryItems[0].id, 'memory-1');
  assert.equal(kept.memoryItems[0].kind, 'memory-item');
  assert.equal(kept.memoryItems[0].status, 'kept');
  assert.equal(kept.memoryItems[0].artworkId, ARTWORKS[2].id);
});

test('展示柜只引用已珍藏藏品，同一藏品换槽时清除旧槽', () => {
  const memoryItems = [
    { id: 'memory-1', kind: 'memory-item', status: 'kept', displaySlot: null },
    { id: 'memory-2', kind: 'memory-item', status: 'kept', displaySlot: null },
  ];
  const first = assignShowcaseSlot({
    memoryItems,
    showcaseSlots: [null, null, null],
    memoryItemId: 'memory-1',
    slotIndex: 0,
  });
  assert.equal(first.ok, true);
  assert.deepEqual(first.showcaseSlots, ['memory-1', null, null]);

  const moved = assignShowcaseSlot({
    memoryItems: first.memoryItems,
    showcaseSlots: first.showcaseSlots,
    memoryItemId: 'memory-1',
    slotIndex: 2,
  });
  assert.equal(moved.ok, true);
  assert.deepEqual(moved.showcaseSlots, [null, null, 'memory-1']);
  assert.equal(moved.memoryItems.find(item => item.id === 'memory-1').displaySlot, 2);

  const missing = assignShowcaseSlot({
    memoryItems: moved.memoryItems,
    showcaseSlots: moved.showcaseSlots,
    memoryItemId: 'missing',
    slotIndex: 1,
  });
  assert.equal(missing.ok, false);
  assert.equal(missing.code, 'MEMORY_ITEM_NOT_FOUND');
});
