/**
 * 扫描 note/*.md 中的外链图片（Markdown ![](url) 与 <img src="...">），
 * 下载到 source/images/note/，并把 Markdown 中的 URL 改为站内绝对路径
 *（须写为 /images/note/xxx，Hexo 会按 root 自动加子路径；勿写 /hexo-site/images/... 否则会重复拼接导致 404）。
 *
 * 用法:
 *   node tool/download-note-images.mjs              # 执行下载与改写
 *   node tool/download-note-images.mjs --dry-run    # 仅列出将处理的 URL
 *   node tool/download-note-images.mjs --force       # 已存在文件也重新下载
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { listNoteMarkdownFiles } from "./note-walk.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const NOTE_DIR = path.join(ROOT, "note");
const IMAGES_DIR = path.join(ROOT, "source", "images", "note");

const CONCURRENCY = 6;
const FETCH_TIMEOUT_MS = 60000;

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  return { dryRun, force };
}

/**
 * 站内图片在 Markdown 中的路径：固定 /images/note/xxx。
 * Hexo 的 url 若在子目录（如 .../hexo-site/），config.root 会为 /hexo-site/，
 * 渲染时会自动拼成 /hexo-site/images/note/xxx；若在正文里再写 /hexo-site/images/... 会重复一段导致 404。
 */
function publicImagePath(fileName) {
  return `/images/note/${fileName}`;
}

function normalizeRemoteUrl(raw) {
  let s = String(raw).trim();
  if (!s || s.startsWith("data:")) return null;
  if (s.startsWith("//")) s = "https:" + s;
  if (!/^https?:\/\//i.test(s)) return null;
  try {
    const u = new URL(s);
    u.protocol = "https:";
    return u.href;
  } catch {
    return null;
  }
}

/** 与 normalize 后 URL 对应的多种正文写法（http / https / 协议相对） */
function urlVariantsForRewrite(canonical) {
  try {
    const u = new URL(canonical);
    const pq = u.pathname + u.search;
    const h = u.host;
    return new Set([
      canonical,
      `http://${h}${pq}`,
      `https://${h}${pq}`,
      `//${h}${pq}`,
    ]);
  } catch {
    return new Set([canonical]);
  }
}

function isAlreadyLocalized(href) {
  return href.trim().startsWith("/images/note/");
}

/** 从正文中收集外链图片 URL */
function collectImageUrls(markdown) {
  const urls = new Set();

  // Markdown: ![alt](url)  — 允许 url 内有括号时取第一个平衡闭合较复杂，此处与现有笔记格式一致
  const mdRe = /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+["'][^"']*["'])?\s*\)/g;
  let m;
  while ((m = mdRe.exec(markdown)) !== null) {
    const href = m[2].trim();
    const n = normalizeRemoteUrl(href);
    if (n && !isAlreadyLocalized(href)) urls.add(n);
  }

  // HTML <img src="...">
  const imgRe = /<img\b[^>]*\bsrc\s*=\s*(["'])([^"']+)\1/gi;
  while ((m = imgRe.exec(markdown)) !== null) {
    const href = m[2].trim();
    const n = normalizeRemoteUrl(href);
    if (n && !isAlreadyLocalized(href)) urls.add(n);
  }

  return urls;
}

function extFromContentType(ct) {
  if (!ct) return null;
  const t = ct.split(";")[0].trim().toLowerCase();
  const map = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/bmp": ".bmp",
  };
  return map[t] || null;
}

function extFromPathname(url) {
  try {
    const p = new URL(url).pathname;
    const ext = path.extname(p).toLowerCase();
    if (ext && ext.length <= 5 && /^\.[a-z0-9]+$/i.test(ext)) return ext;
  } catch {
    /* ignore */
  }
  return ".bin";
}

function hashName(url) {
  return crypto.createHash("md5").update(url).digest("hex");
}

async function fetchImage(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; HexoNoteArchiver/1.0; +https://hexo.io/)",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        // 简书等 CDN 对非本站 Referer 返回 403；不传 Referer
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") || "";
    if (!ct.toLowerCase().startsWith("image/") && buf.length > 200) {
      const head = buf.slice(0, 64).toString("utf8", 0, 64);
      if (head.includes("<html") || head.includes("<!DOCTYPE")) {
        throw new Error("响应非图片（疑似 HTML）");
      }
    }
    let ext = extFromContentType(ct) || extFromPathname(url);
    if (ext === ".bin" && ct.toLowerCase().includes("image")) ext = ".jpg";
    return { buf, ext };
  } finally {
    clearTimeout(t);
  }
}

async function poolMap(items, limit, fn) {
  const ret = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      ret[idx] = await fn(items[idx], idx);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    worker()
  );
  await Promise.all(workers);
  return ret;
}

function rewriteMarkdown(body, urlToFileName) {
  let out = body;
  const jobs = [];
  for (const [canonical, fileName] of urlToFileName) {
    const local = publicImagePath(fileName);
    for (const variant of urlVariantsForRewrite(canonical)) {
      jobs.push({ variant, local, len: variant.length });
    }
  }
  jobs.sort((a, b) => b.len - a.len);
  for (const { variant, local } of jobs) {
    const esc = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(
      new RegExp(`(!\\[[^\\]]*\\]\\()\\s*${esc}\\s*(\\))`, "g"),
      `$1${local}$2`
    );
    out = out.replace(
      new RegExp(`(<img\\b[^>]*\\bsrc\\s*=\\s*)(["'])${esc}\\2`, "gi"),
      `$1$2${local}$2`
    );
  }
  return out;
}

async function main() {
  const { dryRun, force } = parseArgs();

  if (!fs.existsSync(NOTE_DIR)) {
    console.error("未找到 note 目录:", NOTE_DIR);
    process.exit(1);
  }

  const mdFiles = listNoteMarkdownFiles(NOTE_DIR);

  const allUrls = new Set();
  for (const fp of mdFiles) {
    const body = fs.readFileSync(fp, "utf8");
    for (const u of collectImageUrls(body)) allUrls.add(u);
  }

  console.log(
    `正文图片路径: ${publicImagePath("<file>")}（Hexo 会加 root）| 共 ${allUrls.size} 个不重复外链`
  );

  if (allUrls.size === 0) {
    console.log("无需处理。");
    return;
  }

  if (dryRun) {
    for (const u of [...allUrls].sort()) console.log("  ", u);
    console.log("--dry-run 结束，未写入文件。");
    return;
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const urlToFileName = new Map();
  const urlList = [...allUrls];
  const failures = [];

  await poolMap(urlList, CONCURRENCY, async (url) => {
    const base = hashName(url);
    let fileName = null;
    for (const ext of [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]) {
      const f = base + ext;
      if (fs.existsSync(path.join(IMAGES_DIR, f))) {
        fileName = f;
        break;
      }
    }

    if (fileName && !force) {
      urlToFileName.set(url, fileName);
      return;
    }

    try {
      if (force) {
        for (const ext of [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bin"]) {
          const p = path.join(IMAGES_DIR, base + ext);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        }
      }
      const { buf, ext } = await fetchImage(url);
      fileName = base + ext;
      const dest = path.join(IMAGES_DIR, fileName);
      fs.writeFileSync(dest, buf);
      urlToFileName.set(url, fileName);
      process.stdout.write(".");
    } catch (e) {
      failures.push({ url, err: e.message || String(e) });
      process.stdout.write("x");
    }
  });

  console.log("");

  let filesChanged = 0;
  for (const fp of mdFiles) {
    let body = fs.readFileSync(fp, "utf8");
    const next = rewriteMarkdown(body, urlToFileName);
    if (next !== body) {
      fs.writeFileSync(fp, next, "utf8");
      filesChanged++;
    }
  }

  console.log(
    `已下载/复用 ${urlToFileName.size} 个文件到 source/images/note/，改写 ${filesChanged} 篇 note。`
  );

  if (failures.length) {
    console.error(`\n失败 ${failures.length} 个 URL:`);
    for (const { url, err } of failures) console.error(" ", url, "\n   ", err);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
