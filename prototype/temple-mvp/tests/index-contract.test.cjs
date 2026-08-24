const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

test('页面只加载本地脚本，并按内容目录在规则模块之前的顺序接入', () => {
  const scriptSources = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(scriptSources, [
    './three.min.js',
    './content-catalog.js',
    './game-rules.js',
  ]);
  assert.match(html, /window\.TempleMvpContent/);
  assert.match(html, /window\.TempleMvpRules/);
  assert.doesNotMatch(scriptSources.join('\n'), /^https?:/m);
});

test('页面使用统一记忆藏品状态，不再保留旧单唱片所有权', () => {
  assert.match(html, /selectedMaterialIds:\[\]/);
  assert.match(html, /pendingResonanceResult:null/);
  assert.match(html, /memoryItems:\[\]/);
  assert.match(html, /showcaseSlots:\[null,null,null\]/);
  assert.match(html, /resonateMemory\(\{/);
  assert.match(html, /finalizeResonance\(\{/);
  assert.doesNotMatch(html, /synthesizeCollectible\(\{/);
  assert.doesNotMatch(html, /hasRecord:/);
});

test('共鸣结果提供无倒计时观看、左右甄选和等价按钮／键盘', () => {
  for (const id of [
    'resonanceReveal',
    'resonanceCard',
    'resonanceArtwork',
    'resonanceCarrier',
    'returnMemory',
    'keepMemory',
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /resonanceCard\.addEventListener\('pointerdown'/);
  assert.match(html, /resonanceCard\.addEventListener\('pointermove'/);
  assert.match(html, /finalizePendingResult\('return'\)/);
  assert.match(html, /finalizePendingResult\('keep'\)/);
  assert.match(html, /event\.key==='ArrowLeft'/);
  assert.match(html, /event\.key==='ArrowRight'/);
});

test('甄选按钮与载体检视入口不会被父卡片的拖拽捕获吞掉点击', () => {
  assert.match(
    html,
    /event\.target\.closest\('#resonanceActions, #resonanceCarrier'\)/,
  );
  assert.match(html, /360°观察 · \$\{carrier\?\.label/);
});

test('夜间记忆空间是动态多格背包并有筛选、排序和详情入口', () => {
  for (const id of [
    'memorySpaceBtn',
    'memorySpace',
    'memoryGrid',
    'memoryFilter',
    'memorySort',
    'memorySpaceClose',
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /function openMemorySpace\(\)/);
  assert.match(html, /if\(state\.phase!=='NIGHT'\) return/);
  assert.match(html, /function renderMemoryGrid\(\)/);
  assert.match(html, /state\.memoryItems/);
  assert.match(html, /closeMemorySpace\(\)/);
});

test('统一检视器具备拖拽、触摸缩放、滚轮缩放、重置和关闭入口', () => {
  for (const id of [
    'inspect',
    'inspectStage',
    'inspectClose',
    'inspectReset',
    'inspectDisplay',
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /inspectStage\.addEventListener\('pointerdown'/);
  assert.match(html, /inspectStage\.addEventListener\('pointermove'/);
  assert.match(html, /inspectStage\.addEventListener\('wheel'/);
  assert.match(html, /inspectCamera\.position\.z=THREE\.MathUtils\.clamp/);
  assert.match(html, /inspectRoot\.rotation\.y\+=dx\*0\.012/);
});

test('展示柜固定三槽，只通过稳定记忆藏品 ID 策展', () => {
  assert.match(html, /showcaseSlots:\[null,null,null\]/);
  assert.match(html, /\[-1\.68,0,1\.68\]\.forEach/);
  assert.match(html, /function onShowcaseSlotClick\(slotIndex\)/);
  assert.match(html, /assignShowcaseSlot\(\{/);
  assert.match(html, /removeFromShowcase\(\{/);
  assert.match(html, /memoryItemId:/);
  assert.doesNotMatch(html, /state\.displaySlots\[slotIndex\]=collectible/);
});

test('模型工厂覆盖通用载体与四件配方奇珍', () => {
  assert.match(html, /function makeCollectibleModel\(carrierId/);
  for (const factory of [
    'makeUnnamedMemoryBox',
    'makeKaleidoscopeFruit',
    'makeBreadRecord',
    'makeSeedBook',
    'makeMoonLamp',
  ]) {
    assert.match(html, new RegExp(`function ${factory}\\(`));
  }
});

test('寺庙以祈愿厅、处理室和陈列室组成连续空间', () => {
  assert.match(html, /const ROOMS\s*=\s*\{/);
  for (const roomId of ['prayer', 'processing', 'gallery']) {
    assert.match(html, new RegExp(`${roomId}:\\s*\\{`));
  }
  assert.match(html, /function makeRoomShell\(/);
  assert.match(html, /function roomForPosition\(/);
  assert.match(html, /roomChip/);
  assert.doesNotMatch(html, /固定 diorama 机位/);
});

test('白天可在神像与三名房间管理员的具身视角间切换', () => {
  for (const id of ['viewDock', 'roomChip', 'movementHelp']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const viewId of ['statue', 'prayer-manager', 'processing-manager', 'gallery-manager']) {
    assert.match(html, new RegExp(`data-view="${viewId}"`));
  }
  assert.match(html, /const DAY_VIEWPOINTS\s*=\s*\{/);
  assert.match(html, /function makeRoomManager\(/);
  assert.match(html, /function setDayView\(/);
  assert.match(html, /dayViewId:'statue'/);
});

test('夜晚生成独立灵体并支持键盘、点击移动和跟随镜头', () => {
  assert.match(html, /function makeSpiritAvatar\(/);
  assert.match(html, /function updateSpiritMovement\(/);
  assert.match(html, /function updateSpiritCamera\(/);
  assert.match(html, /movementKeys:new Set\(\)/);
  assert.match(html, /moveTarget:null/);
  assert.match(html, /event\.code==='KeyW'/);
  assert.match(html, /event\.code==='ArrowUp'/);
  assert.match(html, /setSpiritMoveTarget\(/);
  assert.match(html, /spiritAvatar\.visible=state\.phase==='NIGHT'/);
});

test('夜间实体交互要求灵体处在正确房间并接近目标', () => {
  assert.match(html, /function requireSpiritNear\(/);
  assert.match(html, /requireSpiritNear\(pet/);
  assert.match(html, /requireSpiritNear\(showcase/);
  assert.match(html, /requireSpiritNear\(item/);
  assert.match(html, /当前在\$\{ROOMS\[state\.activeRoomId\]\.label\}/);
});

test('具身镜头位于对应房间内部，夜间跟随镜头保持在门洞中轴附近', () => {
  const ranges = {
    statue: [-10, 10],
    'prayer-manager': [-10, 10],
    'processing-manager': [-26, -10],
    'gallery-manager': [-42, -26],
  };
  for (const [viewId, [minZ, maxZ]] of Object.entries(ranges)) {
    const marker = viewId === 'statue' ? 'statue:' : `'${viewId}':`;
    const start = html.indexOf(marker, html.indexOf('const DAY_VIEWPOINTS'));
    assert.notEqual(start, -1, `缺少 ${viewId} 镜头`);
    const block = html.slice(start, start + 260);
    const match = block.match(/pos:new THREE\.Vector3\(([-\d.]+),([-\d.]+),([-\d.]+)\)/);
    assert.ok(match, `无法读取 ${viewId} 镜头坐标`);
    const x = Number(match[1]);
    const z = Number(match[3]);
    assert.ok(Math.abs(x) < 7.5, `${viewId} 横向越出房间`);
    assert.ok(z > minZ && z < maxZ, `${viewId} 不在对应房间内部`);
  }
  assert.match(html, /spiritAvatar\.position\.x\*0\.35,-2\.2,2\.2/);
  assert.match(html, /function applyPassageCollision\(/);
});
