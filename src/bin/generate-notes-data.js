// 檔案路徑: src/bin/generate-notes-data.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// 定義專案根目錄 (Root Directory)
// 因為腳本在 src/bin，所以要往上兩層：
const ROOT_DIR = path.join(__dirname, '..', '..'); 

// 設定文章所在的資料夾 (相對於根目錄)
const NOTES_DIR = path.join(ROOT_DIR, 'docs', 'notes-knowledge');
// 設定輸出資料的位置 (相對於根目錄，輸出到 src/data)
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'notes-list.json');

// 確保輸出資料夾存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('正在掃描筆記...');

// 搜尋所有的 .md 和 .mdx 檔案
const files = glob.sync('**/*.{md,mdx}', { cwd: NOTES_DIR });

const notes = files
  .filter(file => !file.includes('index.mdx')) // 排除首頁自己 (index.mdx)
  .map((file) => {
    const filePath = path.join(NOTES_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    // 處理網址路徑 (slug = 檔名)
    const slug = file.replace(/\.(md|mdx)$/, '');
    const link = data.slug 
        ? `/docs${data.slug}` // 如果 data.slug 是 /knowledge-interview，結果會是 /docs/knowledge-interview
        : `/docs/notes-knowledge/${slug}`; // 備援連結

    return {
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : null,
      description: data.description || '',
      image: data.image || '/img/docusaurus.png', // 抓取 image 欄位
      link: link,
    };
  })
  .filter(note => note.date !== null) // 過濾掉沒日期的
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // 依日期排序 (新到舊)

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(notes, null, 2));

console.log(`成功生成！共 ${notes.length} 篇文章，已儲存至 src/data/notes-list.json`);
