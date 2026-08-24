const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ISLANDS,
  MATERIALS,
  RECIPES,
  CARRIERS,
  ARTWORKS,
  getRecipeForMaterials,
} = require('../content-catalog.js');

function uniqueIds(items) {
  return new Set(items.map(item => item.id)).size === items.length;
}

test('内容目录固定前四岛、八材料、四配方、五类载体和十二份艺术品', () => {
  assert.equal(ISLANDS.length, 4);
  assert.equal(MATERIALS.length, 8);
  assert.equal(RECIPES.length, 4);
  assert.equal(CARRIERS.length, 5, '一类通用载体 + 四件配方奇珍');
  assert.equal(ARTWORKS.length, 12);

  for (const items of [ISLANDS, MATERIALS, RECIPES, CARRIERS, ARTWORKS]) {
    assert.equal(uniqueIds(items), true, '同一目录不得出现重复稳定 ID');
  }
});

test('每岛恰有两种材料、一条无序配方和一件专属奇珍', () => {
  for (const island of ISLANDS) {
    const materials = MATERIALS.filter(item => item.islandId === island.id);
    const recipes = RECIPES.filter(item => item.islandId === island.id);
    const relics = CARRIERS.filter(item => item.islandId === island.id && item.rarity === 'formula-relic');

    assert.equal(materials.length, 2, island.id);
    assert.equal(recipes.length, 1, island.id);
    assert.equal(relics.length, 1, island.id);
    assert.deepEqual(new Set(recipes[0].materialIds), new Set(materials.map(item => item.id)));
    assert.equal(recipes[0].carrierId, relics[0].id);
    assert.equal(getRecipeForMaterials([...recipes[0].materialIds].reverse()).id, recipes[0].id);
  }
});

test('艺术池覆盖六类且每类两份，全部明确标注为虚构原型', () => {
  const categories = new Map();
  for (const artwork of ARTWORKS) {
    categories.set(artwork.category, (categories.get(artwork.category) || 0) + 1);
    assert.equal(artwork.prototypeFictional, true);
    assert.ok(artwork.title.startsWith('《') && artwork.title.endsWith('》'));
  }

  assert.deepEqual([...categories.values()].sort((a, b) => a - b), [2, 2, 2, 2, 2, 2]);
});
