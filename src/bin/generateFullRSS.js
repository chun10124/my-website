import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Feed } from "feed";
import { marked } from "marked";

const siteUrl = "https://tzuchun.com";
const outputPath = "./static/rss.xml";

// ====== 日期解析 ======
const TZ_OFFSET = "+08:00"; // 台北時區 (UTC+8)
const DEFAULT_TIME = "21:00:00"; // 只有日期、沒寫時間時，預設台北晚上 9 點

// 把「只有日期」的資訊組成台北當天 21:00 的 Date，
// 避免被 JS 當成 UTC 午夜（= 台北早上 8 點），害文章在讀者的「Today」分頁提早過期。
function taipeiDateOnly(y, m, d) {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return new Date(`${y}-${mm}-${dd}T${DEFAULT_TIME}${TZ_OFFSET}`);
}

function resolveDate(data, file) {
  // 1. front matter date
  if (data.date) {
    // YAML 會把純日期（例如 2026-04-14）解析成「UTC 午夜」的 Date 物件，
    // 這種情況視為「只有日期」，補成台北 21:00。
    if (data.date instanceof Date) {
      if (data.date.toISOString().endsWith("T00:00:00.000Z")) {
        return taipeiDateOnly(
          data.date.getUTCFullYear(),
          data.date.getUTCMonth() + 1,
          data.date.getUTCDate()
        );
      }
      return data.date; // 作者有寫明確時間 → 尊重原值
    }
    // 字串型態的 date
    const s = String(data.date).trim();
    const dateOnly = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (dateOnly) return taipeiDateOnly(dateOnly[1], dateOnly[2], dateOnly[3]);
    const parsed = new Date(s);
    if (!isNaN(parsed)) return parsed;
  }

  // 2. filename: YYYY-M-D-x.md（容許單位數月/日，例如 2026-4-17）
  const filename = path.basename(file);
  const match = filename.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return taipeiDateOnly(match[1], match[2], match[3]);
  }

  // 3. fallback: mtime
  const stats = fs.statSync(file);
  return stats.mtime;
}

// ====== 初始化 Feed ======
const feed = new Feed({
  title: "TzuChun.Blog 全站 RSS Feed",
  id: siteUrl,
  link: siteUrl,
  language: "zh",
  favicon: `${siteUrl}/img/icon.logo.png`,
  copyright: `© ${new Date().getFullYear()} TzuChun`,
});

// ==============================================
// 先收集所有項目 (blog + docs)
// ==============================================
let items = [];

// ====== 讀取 blog ======
const blogRoot = "./blog";

function getAllBlogMarkdown(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results = results.concat(getAllBlogMarkdown(full));
    else if (entry.endsWith(".md") || entry.endsWith(".mdx")) results.push(full);
  }
  return results;
}

if (fs.existsSync(blogRoot)) {
  const blogFiles = getAllBlogMarkdown(blogRoot);

  for (const file of blogFiles) {
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);

    if (!data.title || data.draft) continue;

    const cleanSlug = data.slug.replace(/^\/|\/$/g, "");
    const permalink = `${siteUrl}/blog/${cleanSlug}`;

    const html = marked
      .parse(content)
      .replace(/src="(?:\.{1,2}\/)?(blogimg|img)\//g, `src="${siteUrl}/$1/`);

    items.push({
      title: data.title,
      id: permalink,
      link: permalink,
      date: resolveDate(data, file),
      content: html,
    });
  }
} else {
  console.warn("⚠️ Blog 資料夾未找到，略過 Blog 部分");
}

// ====== 讀取 docs (只抓 rss: true) ======
const docsRoot = "./docs";

function getAllMarkdown(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results = results.concat(getAllMarkdown(full));
    else if (entry.endsWith(".md") || entry.endsWith(".mdx")) results.push(full);
  }
  return results;
}

if (fs.existsSync(docsRoot)) {
  const allDocs = getAllMarkdown(docsRoot);

  for (const file of allDocs) {
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);
    
    if (data.draft || data.rss !== true) continue;
    if (data.rss !== true) continue;

    let permalink;
    if (data.slug) {
      const cleanSlug = data.slug.replace(/^\/|\/$/g, "");
      permalink = `${siteUrl}/docs/${cleanSlug}/`;
    } else {
      const relPath = path
        .relative(docsRoot, file)
        .replace(/\\/g, "/")
        .replace(/\.(md|mdx)$/, "");
      permalink = `${siteUrl}/docs/${relPath}/`;
    }

    const html = marked
      .parse(content)
      .replace(/src="\.\/img/g, `src="${siteUrl}/img`);

    items.push({
      title: data.title || path.basename(file, path.extname(file)),
      id: permalink,
      link: permalink,
      date: resolveDate(data, file),
      content: html,
    });
  }
} else {
  console.warn("⚠️ Docs 資料夾未找到，略過 Docs 部分");
}

// ==============================================
// 🚨 重要：統一依日期排序（最新 → 最舊）
// ==============================================
items.sort((a, b) => new Date(b.date) - new Date(a.date));

// ==============================================
// 最後一次性加入 feed
// ==============================================
for (const item of items) {
  feed.addItem(item);
}

// ====== 輸出 RSS ======
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, feed.rss2(), "utf-8");

console.log("✅ 全站 RSS 已生成：", outputPath);

