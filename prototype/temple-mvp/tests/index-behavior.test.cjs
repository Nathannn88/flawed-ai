const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function extractBracedBody(source, marker) {
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, `缺少实现标记：${marker}`);
  const braceStart = source.indexOf('{', markerIndex + marker.length);
  assert.notEqual(braceStart, -1, `缺少函数体：${marker}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(braceStart + 1, index);
    }
  }
  assert.fail(`函数体没有闭合：${marker}`);
}

const keydownBody = extractBracedBody(
  html,
  "document.addEventListener('keydown',event=>",
);
const executeKeydown = new Function(
  'state',
  'worldInputBlocked',
  'finalizePendingResult',
  'closeInspect',
  'closeMemorySpace',
  'dom',
  'event',
  keydownBody,
);

function runKeydown({
  key,
  code = key,
  pending = true,
  inspectOpen = false,
  memorySpaceOpen = false,
  dialogueOpen = false,
  targetTag = 'DIV',
  targetContentEditable = false,
}) {
  const state = {
    pendingResonanceResult: pending ? { id: 'test-result' } : null,
    inspectOpen,
    memorySpaceOpen,
    dialogueOpen,
    phase: 'NIGHT',
    movementKeys: new Set(),
    moveTarget: { x: 1, z: 1 },
  };
  const dom = { intro: { style: { display: 'none' } } };
  const decisions = [];
  const event = {
    key,
    code,
    target: {
      tagName: targetTag,
      isContentEditable: targetContentEditable,
    },
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
  };
  const worldInputBlocked = () => (
    state.dialogueOpen
    || state.inspectOpen
    || state.memorySpaceOpen
    || Boolean(state.pendingResonanceResult)
    || dom.intro.style.display !== 'none'
  );
  executeKeydown(
    state,
    worldInputBlocked,
    decision => decisions.push(decision),
    () => {
      state.inspectOpen = false;
    },
    () => {
      state.memorySpaceOpen = false;
    },
    dom,
    event,
  );
  return { state, event, decisions };
}

test('检视、记忆空间或对话位于待甄选结果之上时，左右方向键只被覆盖层消费', () => {
  const overlays = [
    { inspectOpen: true },
    { memorySpaceOpen: true },
    { dialogueOpen: true },
  ];
  for (const overlay of overlays) {
    for (const [key, forbiddenDecision] of [
      ['ArrowLeft', 'return'],
      ['ArrowRight', 'keep'],
    ]) {
      const result = runKeydown({ key, ...overlay });
      assert.deepEqual(
        result.decisions,
        [],
        `${Object.keys(overlay)[0]} + ${key} 不得触发 ${forbiddenDecision}`,
      );
      assert.equal(result.event.defaultPrevented, true, `${key} 应被上层覆盖层消费`);
      assert.equal(result.state.movementKeys.size, 0, `${key} 不得传递给世界移动`);
    }
  }
});

test('Escape 先关闭最上层检视或记忆空间，不提交待甄选结果', () => {
  const inspect = runKeydown({ key: 'Escape', inspectOpen: true });
  assert.equal(inspect.state.inspectOpen, false);
  assert.deepEqual(inspect.decisions, []);

  const memory = runKeydown({ key: 'Escape', memorySpaceOpen: true });
  assert.equal(memory.state.memorySpaceOpen, false);
  assert.deepEqual(memory.decisions, []);
});

test('没有上层覆盖时，待甄选结果仍支持左右方向键；没有待甄选时世界移动恢复', () => {
  assert.deepEqual(runKeydown({ key: 'ArrowLeft' }).decisions, ['return']);
  assert.deepEqual(runKeydown({ key: 'ArrowRight' }).decisions, ['keep']);

  const movement = runKeydown({ key: 'ArrowRight', pending: false });
  assert.deepEqual([...movement.state.movementKeys], ['ArrowRight']);
  assert.equal(movement.state.moveTarget, null);
});

test('可编辑元素中的方向键不提交待甄选结果，也不进入世界移动', () => {
  const editableTargets = [
    { targetTag: 'INPUT' },
    { targetTag: 'TEXTAREA' },
    { targetTag: 'DIV', targetContentEditable: true },
  ];
  for (const target of editableTargets) {
    for (const key of ['ArrowLeft', 'ArrowRight']) {
      const pending = runKeydown({ key, ...target });
      assert.deepEqual(pending.decisions, [], `${target.targetTag} 不得提交 ${key}`);
      assert.equal(pending.event.defaultPrevented, false, `${target.targetTag} 应保留光标默认行为`);
      assert.deepEqual([...pending.state.movementKeys], []);
      assert.deepEqual(pending.state.moveTarget, { x: 1, z: 1 });

      const movement = runKeydown({ key, pending: false, ...target });
      assert.deepEqual(movement.decisions, []);
      assert.equal(movement.event.defaultPrevented, false);
      assert.deepEqual([...movement.state.movementKeys], []);
      assert.deepEqual(
        movement.state.moveTarget,
        { x: 1, z: 1 },
        `${target.targetTag} 内移动光标不得清除世界点击目标`,
      );
    }
  }
});

const collisionBody = extractBracedBody(
  html,
  'function applyPassageCollision(previous,next)',
);
const applyPassageCollision = new Function('previous', 'next', collisionBody);

function collide(previous, desired) {
  const next = { ...desired };
  applyPassageCollision({ ...previous }, next);
  return next;
}

test('两道门洞中央允许双向通过，门洞外墙体阻挡双向直穿', () => {
  for (const boundary of [-10, -26]) {
    for (const direction of [-1, 1]) {
      const previousZ = boundary - direction * 0.1;
      const desiredZ = boundary + direction * 0.1;
      const doorway = collide(
        { x: 0, z: previousZ },
        { x: 0, z: desiredZ },
      );
      assert.equal(doorway.z, desiredZ, `${boundary} 中央应允许方向 ${direction}`);

      const wall = collide(
        { x: 3.3, z: previousZ },
        { x: 3.3, z: desiredZ },
      );
      assert.equal(
        Math.sign(wall.z - boundary),
        Math.sign(previousZ - boundary),
        `${boundary} 外墙应阻挡方向 ${direction}`,
      );
    }
  }
});

test('两道门洞的正负边缘均按越界交点阻挡双向斜穿', () => {
  for (const boundary of [-10, -26]) {
    for (const direction of [-1, 1]) {
      for (const side of [-1, 1]) {
        const previousZ = boundary - direction * 0.1;
        const desiredZ = boundary + direction * 0.1;
        const previousX = side * 3.25;
        const desiredX = side * 3.1;
        const crossingX = (previousX + desiredX) / 2;
        assert.ok(Math.abs(crossingX) > 3.15, '测试交点必须位于门洞之外');

        const next = collide(
          { x: previousX, z: previousZ },
          { x: desiredX, z: desiredZ },
        );
        assert.equal(
          Math.sign(next.z - boundary),
          Math.sign(previousZ - boundary),
          `${boundary} / 方向 ${direction} / 侧边 ${side} 不得在门沿外斜穿`,
        );
      }
    }
  }
});

test('斜向移动的边界交点位于门洞内时仍允许通过', () => {
  for (const boundary of [-10, -26]) {
    for (const direction of [-1, 1]) {
      const previousZ = boundary - direction * 0.1;
      const desiredZ = boundary + direction * 0.1;
      const next = collide(
        { x: 3.1, z: previousZ },
        { x: 3, z: desiredZ },
      );
      assert.equal(next.z, desiredZ, `${boundary} 的合法门内斜向移动应通过`);
    }
  }
});
