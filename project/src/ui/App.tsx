import { useEffect, useState } from 'react';
import type { Dispatch } from 'react';
import { useGame } from './useGame';
import { formName } from '../game/engine';
import type { Action, GameState, Pet, Product, Supply, Worshipper } from '../game/types';

// ⚠️ 渲染层：纯 2D 占位（DOM/CSS）。要换 3D / 预渲染片段，只改本目录，不动 game/。

type SceneProps = { state: GameState; dispatch: Dispatch<Action> };

export function App() {
  const { state, dispatch } = useGame();
  const isDay = state.phase === 'day';

  return (
    <div className="app">
      <header className="topbar">
        <h1>有缺陷的AI · 最小可玩版</h1>
        <div className="status">
          <span className={`phase ${state.phase}`}>{isDay ? '☀️ 白天 · 开门' : '🌙 夜晚 · 关门'}</span>
          <span className="faith">信仰值 {state.faith}</span>
          <button className="door-btn" onClick={() => dispatch({ type: 'TOGGLE_DOOR' })}>
            {isDay ? '关门 · 入夜' : '开门 · 天明'}
          </button>
        </div>
      </header>

      <main className="stage-wrap">
        <section className={`temple ${state.phase}`}>
          <div className={`door ${isDay ? 'open' : 'closed'}`} aria-hidden />
          {isDay ? <DayScene state={state} dispatch={dispatch} /> : <NightScene state={state} dispatch={dispatch} />}
        </section>

        <aside className="panel">
          <Inventory supplies={state.inventory.supplies} products={state.inventory.products} />
          <EventLog log={state.log} />
        </aside>
      </main>
    </div>
  );
}

function DayScene({ state, dispatch }: SceneProps) {
  return (
    <div className="scene day-scene">
      <div className="green-zone">
        <span className="zone-label">供奉区（绿区）</span>
        <div className="chips">
          {state.greenZone.length === 0 && <span className="empty">（空）</span>}
          {state.greenZone.map((s) => (
            <SupplyChip key={s.id} supply={s} />
          ))}
        </div>
      </div>

      <div className="crowd">
        {state.worshippers.length === 0 && <p className="hint">点击下方「召集信众」，看看谁来上贡。</p>}
        {state.worshippers.map((w) => (
          <WorshipperView
            key={w.id}
            w={w}
            onClick={() => dispatch({ type: 'CLICK_WORSHIPPER', id: w.id })}
            onGone={() => dispatch({ type: 'DEPART_DONE', id: w.id })}
          />
        ))}
      </div>

      <div className="controls">
        <button onClick={() => dispatch({ type: 'SPAWN_GROUP' })}>召集信众</button>
      </div>
    </div>
  );
}

function NightScene({ state, dispatch }: SceneProps) {
  const { pet } = state;
  return (
    <div className="scene night-scene">
      <div className="green-zone night">
        <span className="zone-label">待回收</span>
        <div className="chips">
          {state.greenZone.length === 0 && <span className="empty">（空）</span>}
          {state.greenZone.map((s) => (
            <SupplyChip key={s.id} supply={s} clickable onClick={() => dispatch({ type: 'PICKUP_SUPPLY', id: s.id })} />
          ))}
        </div>
      </div>

      <div className="deity-row">
        <div className="deity" title="夜晚：神像化为诗人灵体">
          <span className="deity-emoji">👻</span>
          <small>诗人灵体</small>
        </div>
        <PetView pet={pet} onClick={() => dispatch({ type: 'CLICK_PET' })} />
      </div>

      {pet.form === 'breadMachine' && (
        <div className="machine-panel">
          {!pet.processing && !pet.output && (
            <div className="load">
              <span>投入材料：</span>
              {state.inventory.supplies.length === 0 ? (
                <em>物品栏没有小麦，先从「待回收」拾取。</em>
              ) : (
                state.inventory.supplies.map((s) => (
                  <button key={s.id} onClick={() => dispatch({ type: 'LOAD_MATERIAL', supplyId: s.id, now: Date.now() })}>
                    🌾 投入小麦
                  </button>
                ))
              )}
            </div>
          )}
          {pet.processing && <ProgressBar startedAt={pet.processing.startedAt} durationMs={pet.processing.durationMs} />}
          {pet.output && (
            <div className="output">
              成品就绪：{productEmoji(pet.output)} <button onClick={() => dispatch({ type: 'COLLECT_PRODUCT' })}>收取</button>
            </div>
          )}
        </div>
      )}

      {pet.form === 'recordPlayer' && (
        <div className="machine-panel">
          {state.inventory.products.length > 0 ? (
            <div className="playing">♪♪ 正在播放作品（共 {state.inventory.products.length} 件）… ♪♪</div>
          ) : (
            <em>还没有成品可播放，先用面包机加工。</em>
          )}
        </div>
      )}

      {pet.form === 'dog' && <p className="hint">点击宠物 → 变成面包机加工 / 唱片机播放。</p>}
    </div>
  );
}

function WorshipperView({ w, onClick, onGone }: { w: Worshipper; onClick: () => void; onGone: () => void }) {
  const leaving = w.walk === 'leaving';
  return (
    <button
      className={`worshipper ${leaving ? 'leaving' : ''}`}
      onClick={leaving ? undefined : onClick}
      onTransitionEnd={leaving ? onGone : undefined}
      title={w.offered ? `${w.name}（已供奉，离开中）` : `${w.name}（点击收取供品）`}
    >
      <span className="avatar">🧑</span>
      <span className="wname">{w.name}</span>
      {w.supply && <span className="held">🌾</span>}
    </button>
  );
}

function PetView({ pet, onClick }: { pet: Pet; onClick: () => void }) {
  const emoji = pet.form === 'dog' ? '🐕' : pet.form === 'breadMachine' ? '🥯' : '📀';
  return (
    <button className={`pet ${pet.form}`} onClick={onClick} title="点击变形">
      <span className="pet-emoji">{emoji}</span>
      <span className="pet-name">{formName(pet.form)}</span>
    </button>
  );
}

function SupplyChip({ supply, clickable, onClick }: { supply: Supply; clickable?: boolean; onClick?: () => void }) {
  return (
    <button className={`chip ${clickable ? 'clickable' : ''}`} disabled={!clickable} onClick={onClick}>
      🌾 {supply.kind === 'wheat' ? '小麦' : supply.kind}
    </button>
  );
}

function ProgressBar({ startedAt, durationMs }: { startedAt: number; durationMs: number }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((c) => c + 1), 250);
    return () => clearInterval(t);
  }, []);
  const elapsed = Date.now() - startedAt;
  const pct = Math.min(100, (elapsed / durationMs) * 100);
  const remain = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
  return (
    <div className="progress">
      <div className="bar" style={{ width: `${pct}%` }} />
      <span className="pct">面包机加工中… 约 {remain}s</span>
    </div>
  );
}

function Inventory({ supplies, products }: { supplies: Supply[]; products: Product[] }) {
  return (
    <div className="inv">
      <h2>物品栏</h2>
      <div className="inv-row">
        <span className="inv-label">材料</span>
        <div className="items">{supplies.length ? supplies.map((s) => <span key={s.id} className="item">🌾</span>) : <em>空</em>}</div>
      </div>
      <div className="inv-row">
        <span className="inv-label">成品</span>
        <div className="items">{products.length ? products.map((p) => <span key={p.id} className="item">{productEmoji(p)}</span>) : <em>空</em>}</div>
      </div>
    </div>
  );
}

function EventLog({ log }: { log: string[] }) {
  return (
    <div className="log">
      <h2>事件</h2>
      <ul>
        {log.map((l, i) => (
          <li key={`${i}-${l}`} className={i === 0 ? 'latest' : ''}>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function productEmoji(p: Product): string {
  return p.kind === 'bread' ? '🍞' : '📀';
}
