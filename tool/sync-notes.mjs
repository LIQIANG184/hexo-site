/**
 * 将 note/ 目录下的 .md 同步为 source/_posts 下的 Hexo 文章。
 * 放在 tool/ 而非 scripts/，避免被 Hexo 当作站点脚本加载。
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const NOTE_DIR = path.join(ROOT, "note");
const POSTS_DIR = path.join(ROOT, "source", "_posts");

function yamlString(s) {
  if (s == null) return '""';
  const t = String(s);
  if (/[\n\r"]/.test(t) || /[:#]/.test(t) || t.startsWith(" ") || t.endsWith(" "))
    return JSON.stringify(t);
  return `"${t.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function stripFrontMatter(body) {
  if (!body.startsWith("---")) return body;
  const end = body.indexOf("\n---", 3);
  if (end === -1) return body;
  return body.slice(end + 4).replace(/^\s*\n/, "");
}

function parseDateFromName(name) {
  const m = name.match(/^(\d{4})-(\d{2})-(\d{2})\.md$/i);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
}

function safeFileBase(title, date) {
  let s = title
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  if (!s) s = "untitled";
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${mo}-${d}-${s}`;
}

function main() {
  if (!fs.existsSync(NOTE_DIR)) {
    console.error("未找到 note 目录:", NOTE_DIR);
    process.exit(1);
  }
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (!f.endsWith(".md")) continue;
    const p = path.join(POSTS_DIR, f);
    const raw = fs.readFileSync(p, "utf8");
    if (raw.startsWith("---\n") && raw.includes("from_note: true")) {
      fs.unlinkSync(p);
    }
  }

  const files = fs
    .readdirSync(NOTE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, "zh-CN"));

  let n = 0;
  const used = new Set();

  for (const file of files) {
    const src = path.join(NOTE_DIR, file);
    let body = fs.readFileSync(src, "utf8");
    const title = file.replace(/\.md$/i, "");
    const stat = fs.statSync(src);
    let date = parseDateFromName(file) || stat.mtime;

    if (!body.trim()) {
      body = "_（原文为空）_\n";
    } else if (body.trimStart().startsWith("---")) {
      body = stripFrontMatter(body);
    }

    let base = safeFileBase(title, date);
    let outName = `${base}.md`;
    let i = 0;
    while (used.has(outName)) {
      i += 1;
      const h = crypto.createHash("md5").update(file + String(i)).digest("hex").slice(0, 6);
      outName = `${base}-${h}.md`;
    }
    used.add(outName);

    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    const dateLine = `${y}-${mo}-${d} ${hh}:${mm}:${ss}`;

    const fm = `---
title: ${yamlString(title)}
date: ${dateLine}
tags:
  - 笔记
categories:
  - 笔记
from_note: true
source_note: ${yamlString(file)}
---

`;

    fs.writeFileSync(path.join(POSTS_DIR, outName), fm + body, "utf8");
    n += 1;
  }

  console.log(`已从 note/ 同步 ${n} 篇文章到 source/_posts/`);
}

main();
