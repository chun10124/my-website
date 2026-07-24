const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// 定義路徑
const ROOT_DIR = path.join(__dirname, '..', '..'); 
const BOOKS_DIR = path.join(ROOT_DIR, 'docs', 'notes-books');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'books-list.json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('正在掃描讀書心得（採用 Slug 優先邏輯）...');

const files = glob.sync('**/*.{md,mdx}', { cwd: BOOKS_DIR });

const books = files
  .filter(file => !file.includes('index.mdx')) // 排除首頁
  .map((file) => {
    const filePath = path.join(BOOKS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    // 取得不含副檔名的檔名 (Slug 備援)
    const slug = file.replace(/\.(md|mdx)$/, '');
    
    // --- 這裡加入了你之前成功過的處理邏輯 ---
    const link = data.slug 
        ? `/docs${data.slug}` // 如果 slug 是 /books-xxx，會變成 /docs/books-xxx
        : `/docs/notes-books/${slug}`; // 否則預設為資料夾路徑

    return {
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : null,
      description: data.description || '點擊閱讀完整筆記內容...',
      book_cover: data.book_cover || '/img/icon.logo.JPG',
      link: link, // 使用處理後的連結
    };
  })
  .filter(note => note.date !== null) 
  .sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(books, null, 2));
console.log(`成功生成！共 ${books.length} 篇心得，已儲存至 src/data/books-list.json`);