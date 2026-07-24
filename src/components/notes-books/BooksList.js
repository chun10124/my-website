import React from 'react';
import Link from '@docusaurus/Link';

let booksData = [];
try {
  booksData = require('@site/src/data/books-list.json');
} catch (e) {
  booksData = [];
}

export default function BooksList() {
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  if (booksData.length === 0) {
    return (
      <div style={{ padding: '20px', border: '1px dashed #ccc', textAlign: 'center' }}>
        目前尚無心得文章。
      </div>
    );
  }

  return (
    <div className="book-list-container">
      {booksData.map((book, idx) => (
        <div key={idx} className="book-item-row">
          {/* 左側：書的照片 (直式比例) */}
          <div className="book-cover-wrapper">
            <Link to={book.link}>
              <img 
                src={book.book_cover} 
                alt={book.title} 
                className="book-cover-img"
              />
            </Link>
          </div>

          {/* 右側：書籍資訊 */}
          <div className="book-info-content">
            <div className="book-meta-date">{formatDate(book.date)}</div>
            <h3 className="book-item-title">
              <Link to={book.link}>{book.title}</Link>
            </h3>
            <p className="book-item-desc">{book.description}</p>
            <Link to={book.link} className="book-read-link">閱讀全文 →</Link>
          </div>
        </div>
      ))}

      <style>{`
        .book-list-container { 
          margin-top: 1.5rem; 
        }
        .book-item-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--ifm-color-emphasis-200);
          align-items: flex-start;
        }

        /* 書的照片區塊：設定為直式比例 */
        .book-cover-wrapper {
          flex: 0 0 120px; /* 固定寬度 */
        }
        .book-cover-img {
          width: 100%;
          height: 170px; /* 設定高度，呈現 120:170 的直式比例 */
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* 增加一點點立體感，像實體書 */
          display: block;
        }

        /* 文字資訊區塊 */
        .book-info-content {
          flex: 1;
        }
        .book-meta-date {
          color: var(--ifm-color-emphasis-600);
          font-size: 0.85rem;
          margin-bottom: 0.3rem;
        }
        .book-item-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.4rem;
          line-height: 1.3;
        }
        .book-item-title a {
          color: var(--ifm-link-color);
          text-decoration: none;
        }
        .book-item-title a:hover {
          color: var(--ifm-color-primary);
        }
        .book-item-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--ifm-font-color-base);
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .book-read-link {
          font-size: 0.9rem;
          font-weight: bold;
          text-decoration: none;
        }

        /* 手機版調整 */
        @media (max-width: 576px) {
          .book-item-row {
            gap: 1rem;
          }
          .book-cover-wrapper {
            flex: 0 0 90px; /* 手機上更小一點 */
          }
          .book-cover-img {
            height: 130px;
          }
          .book-item-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}