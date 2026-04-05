/**
 * 导出设计文档到 design/_shared-google-drive/
 * Obsidian .md → 剥离专有语法 → pandoc → .docx
 *
 * Usage: node design/_export-scripts/export-shared.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, unlinkSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESIGN_DIR = join(__dirname, '..');
const SHARED_DIR = join(DESIGN_DIR, '_shared-google-drive');

// --- 文件映射 ---

const FILE_MAP = [
  { src: 'story/世界观.md',      dest: '01-世界观与叙事/世界观与项目本质', convert: true },
  { src: 'story/事件剧本.md',    dest: '01-世界观与叙事/事件剧本',         convert: true, postProcess: stripEventIdColumn },
  { src: 'character/诗人设定.md', dest: '02-角色设计/诗人设定',             convert: true },
  { src: 'character/企鹅设定.md', dest: '02-角色设计/企鹅设定',             convert: true },
  { src: 'style/视觉风格.md',    dest: '03-视觉风格/视觉风格',             convert: true, postProcess: stripTechReferences },
  { src: 'system/系统机制.md',   dest: '04-系统机制/系统机制',              convert: true },
];

// --- 转换函数 ---

function stripFrontmatter(content) {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (match) {
    content = content.slice(match[0].length);
  }
  return content.replace(/^\n+/, '');
}

function stripWikilinks(content) {
  // [[link|display text]] → display text
  content = content.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  // [[link]] → link
  content = content.replace(/\[\[([^\]]+)\]\]/g, '$1');
  // ![[embed]] → remove entire line
  content = content.replace(/^.*!\[\[.*\]\].*\r?\n?/gm, '');
  return content;
}

function stripEventIdColumn(content) {
  // 事件剧本.md 的表格有 3 列: 阈值 | 事件 ID | 标题
  // 需要删除 事件 ID 列，变为: 阈值 | 标题
  const lines = content.split('\n');
  const result = [];

  for (const line of lines) {
    if (line.includes('|') && (line.includes('event-') || line.includes('事件 ID'))) {
      // 这是含 event ID 的表格行，删除第二列
      const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
      if (cells.length >= 3) {
        // 保留第 1 列和第 3 列
        result.push(`| ${cells[0]} | ${cells[2]} |`);
        continue;
      }
    }
    if (line.match(/^\|[-\s|]+\|$/) && result.length > 0 && result[result.length - 1].split('|').filter(c => c.trim()).length === 2) {
      // 分隔行也需要调整列数
      result.push('|------|------|');
      continue;
    }
    result.push(line);
  }

  return result.join('\n');
}

function stripTechReferences(content) {
  // 删除 "见同目录下 design-system 和 tailwind-tokens" 及相关行
  return content
    .replace(/^>.*见同目录下.*design-system.*tailwind-tokens.*\r?\n?/gm, '')
    .replace(/^>.*见同目录下.*\r?\n?/gm, '')
    .replace(/## 详细视觉规范\s*\n*$/gm, '');
}

function processFile(content, entry) {
  content = stripFrontmatter(content);
  content = stripWikilinks(content);
  if (entry.postProcess) {
    content = entry.postProcess(content);
  }
  // 清理末尾多余空行
  content = content.trimEnd() + '\n';
  return content;
}

// --- 使用说明 ---

const README_CONTENT = `# 有缺陷的AI — 设计文档

> 一个拥有独特人格与完整成长结构的 AI 诗人应用。

---

## 阅读顺序

请按以下顺序阅读，后面的内容依赖前面的设定：

1. **01-世界观与叙事** — 项目的根基：哲学、异世界背景、终局叙事
2. **02-角色设计** — 诗人人格与企鹅设定
3. **03-视觉风格** — 视觉方向与氛围
4. **04-系统机制** — 产品流程、成长系统、付费、终局机制

## 依赖关系

\`\`\`
世界观与叙事（基础层）
  ├→ 角色设计（角色的使命和离别命运来自世界观）
  ├→ 系统机制（事件阈值和终局选择的叙事意义来自世界观）
  └→ 视觉风格（反映角色气质与异世界氛围）
\`\`\`

## 协作说明

- 这是设计文稿的共享副本，修改会定期同步
- 推荐使用 Google Docs 的 **评论功能** 或 **建议模式** 标注修改意见
- 大幅度改动前建议先在评论中讨论
- 如果直接修改了正文内容，请在文档开头留一行说明改了什么
`;

// --- 主逻辑 ---

function cleanSharedDir() {
  const subdirs = ['01-世界观与叙事', '02-角色设计', '03-视觉风格', '04-系统机制'];
  for (const sub of subdirs) {
    const dir = join(SHARED_DIR, sub);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
  }
}

function findPandoc() {
  // pandoc 可能在 PATH 中，也可能在 Windows 默认安装路径
  try {
    execSync('pandoc --version', { stdio: 'pipe' });
    return 'pandoc';
  } catch {
    const winPath = 'C:/Users/' + process.env.USERNAME + '/AppData/Local/Pandoc/pandoc.exe';
    try {
      execSync(`"${winPath}" --version`, { stdio: 'pipe' });
      return `"${winPath}"`;
    } catch {
      // 尝试 Program Files 路径
      const progPath = 'C:/Program Files/Pandoc/pandoc.exe';
      try {
        execSync(`"${progPath}" --version`, { stdio: 'pipe' });
        return `"${progPath}"`;
      } catch {
        return null;
      }
    }
  }
}

function convertToDocx(mdContent, outputPath, pandocCmd) {
  const tmpMd = outputPath.replace(/\.docx$/, '.tmp.md');
  writeFileSync(tmpMd, mdContent, 'utf-8');

  try {
    execSync(`${pandocCmd} "${tmpMd}" -o "${outputPath}" --from=markdown --to=docx`, {
      stdio: 'pipe',
    });
  } finally {
    try { unlinkSync(tmpMd); } catch {}
  }
}

function main() {
  console.log('=== 导出设计文档到 design/shared/ ===\n');

  // 查找 pandoc
  const pandocCmd = findPandoc();
  if (!pandocCmd) {
    console.error('❌ pandoc 未找到。请安装: winget install pandoc');
    process.exit(1);
  }
  console.log(`✓ pandoc: ${pandocCmd}\n`);

  // 创建/清空目录
  mkdirSync(SHARED_DIR, { recursive: true });
  cleanSharedDir();

  // 导出设计文档
  let count = 0;
  for (const entry of FILE_MAP) {
    const srcPath = join(DESIGN_DIR, entry.src);
    const destPath = join(SHARED_DIR, entry.dest + '.docx');

    try {
      let content = readFileSync(srcPath, 'utf-8');
      content = processFile(content, entry);
      mkdirSync(dirname(destPath), { recursive: true });
      convertToDocx(content, destPath, pandocCmd);
      count++;
      console.log(`  ✓ ${entry.src} → ${entry.dest}.docx`);
    } catch (err) {
      console.error(`  ✗ ${entry.src}: ${err.message}`);
    }
  }

  // 导出使用说明
  try {
    const readmePath = join(SHARED_DIR, '使用说明.docx');
    convertToDocx(README_CONTENT, readmePath, pandocCmd);
    count++;
    console.log(`  ✓ 使用说明.docx`);
  } catch (err) {
    console.error(`  ✗ 使用说明: ${err.message}`);
  }

  console.log(`\n=== 完成：共导出 ${count} 个文件到 design/shared/ ===`);
}

main();
