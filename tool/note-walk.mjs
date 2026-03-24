/**
 * 递归列出 note 目录下所有 .md 文件路径（绝对路径），按中文路径排序。
 */
import fs from "fs";
import path from "path";

export function listNoteMarkdownFiles(noteDir) {
  const out = [];
  if (!fs.existsSync(noteDir)) return out;

  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.isFile() && ent.name.toLowerCase().endsWith(".md")) out.push(p);
    }
  }
  walk(noteDir);
  return out.sort((a, b) => a.localeCompare(b, "zh-CN"));
}

/** 相对 note/ 的路径，正斜杠（用于 front matter 记录） */
export function noteRelativePosix(noteDir, absPath) {
  return path.relative(noteDir, absPath).split(path.sep).join("/");
}

/**
 * 分类名：取相对路径的第一级目录名；若 .md 直接在 note/ 下则返回 defaultCategory
 */
export function categoryFromNotePath(noteDir, absPath, defaultCategory = "笔记") {
  const rel = path.relative(noteDir, absPath);
  const parts = rel.split(path.sep);
  if (parts.length < 2) return defaultCategory;
  return parts[0] || defaultCategory;
}
