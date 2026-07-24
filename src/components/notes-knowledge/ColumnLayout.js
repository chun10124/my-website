import React from 'react';
import Link from '@docusaurus/Link';
// 透過 Docusaurus 的別名引入剛剛生成的 JSON 資料
import notesData from '@site/src/data/notes-list.json'; 

export default function ColumnLayout() {
  // 日期格式化小工具
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="article-list">
      {notesData.map((note, idx) => (
        <div key={idx} className="article-row">
          
          {/* 左邊：圖片區 (點擊圖片可進入文章) */}
          <div className="article-img-box">
            <Link to={note.link}>
              <img src={note.image} alt={note.title} />
            </Link>
          </div>

          {/* 右邊：文字區 */}
          <div className="article-content">
            <div className="article-date">{formatDate(note.date)}</div>
            <h2 className="article-title">
              <Link to={note.link}>{note.title}</Link>
            </h2>
            <p className="article-desc">{note.description}</p>
            <Link to={note.link} className="read-more">閱讀全文 →</Link>
          </div>

        </div>
      ))}

      {/* CSS 樣式區域 (可以直接寫在這裡，讓這個元件具有獨立的樣式) */}
      <style>{`
        .article-list { 
          margin-top: 1rem; 
          max-width: 900px; /* 限制列表寬度讓視覺更舒適 */
        }
        
        .article-row {
          display: flex;       /* 讓圖片跟文字並排 */
          gap: 1.2rem;           /* 中間間距 */
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--ifm-color-emphasis-200); /* 列表底線 */
          align-items: flex-start; /* 確保圖片和文字是靠上對齊 */
        }

        /* 圖片區塊設定 */
        .article-img-box {
          flex: 0 0 240px;     /* 固定圖片寬度 */
          overflow: hidden;
          border-radius: 0;
          box-shadow: none;
        }
        .article-img-box img {
          width: 95%;
          height: 150px;
          object-fit: cover;   /* 圖片填滿裁切 */
          display: block;
        }

        /* 文字區塊設定 */
        .article-content {
          flex: 1;             /* 佔滿剩下空間 */
        }

        .article-date { color: var(--ifm-color-emphasis-600); font-size: 0.9rem; margin-bottom: 0.5rem; }
        
        .article-title { margin: 0 0 0.5rem 0; font-size: 1.5rem; }
        .article-title a { 
          color: var(--ifm-link-color); /* 關鍵修正：從 primary 改為 link-color */
          text-decoration: none; 
        }
        .article-title a:hover {
          color: var(--ifm-color-primary-lighter);
          text-decoration: none; /* 確保不會出現底線 */
        }

        html[data-theme='dark'] .article-title a:hover {
          color: var(--ifm-color-primary); 
          text-decoration: none; 
        }
        
        .article-desc { color: var(--ifm-color-content); margin-bottom: 1rem; line-height: 1.6; }
        .read-more { font-weight: bold; font-size: 0.9rem; }
        .read-more:hover {
          color: var(--ifm-color-primary-lighter); /* 懸浮時變為更深的品牌色 */
          text-decoration: none; /* 確保不會出現底線 */
        }

        html[data-theme='dark'] .read-more:hover {
          color: var(--ifm-color-primary); 
          text-decoration: none; 
        }

        /* 手機版：變成上下排列 */
        @media (max-width: 768px) {
          .article-row { flex-direction: column; gap: 1rem; }
          .article-img-box { flex: none; width: 100%; }
          .article-img-box img { 
            height: 160px; /* 建議值：從 200px 縮小至 150px */
            width: 250px;
          }
          .article-date {
            margin-bottom: 0.2rem; /* 手機版：日期下緣縮小 */
          }
          .article-title {
            margin: 0.2rem 0; /* 手機版：標題上下邊緣縮小 */
          }
          .article-desc {
            margin-bottom: 0.5rem; /* 手機版：描述下緣縮小 */
          }
          .article-row {
            /* ****** 關鍵修正：減少分隔線周圍的空間 ****** */
            margin-bottom: 1.5rem;  
            padding-bottom: 1rem;    
          }
      }
      `}</style>
    </div>
  );
}