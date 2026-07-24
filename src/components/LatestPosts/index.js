import React from "react";
import Link from "@docusaurus/Link";
import styles from "./LatestPosts.module.css";

import latestBlogPostList from "./latest-blog-posts.json";
import latestDocsList from "./latest-docs.json";

// 修正：在 Props 中加入 image 屬性
function Post({ title, description, permalink, tags, formattedDate, image }) {
  return (
    <div className={styles.latest_post_row_item} key={permalink}>
      
      {/* 🖼️ 圖片區塊 (只有當 image 屬性存在時才顯示) */}
      {image && (
        <div className={styles.post_list_image_container}>
          <Link to={permalink}>
              <img src={image} alt={title} className={styles.post_list_thumbnail} />
          </Link>
        </div>
      )}

      {/* 內容區塊 - 這是你原本缺少的區塊！ */}
      <div className={styles.post_content_container}>
        
        {/* 📅 日期顯示區塊：使用修正後的 formattedDate */}
        <div className={styles.post_list_moved_date}> 
          {formattedDate} 
        </div>

        <div className={styles.latest_post_row_item_title}>
          <Link to={permalink}>{title}</Link>
        </div>
        
        {description && (
          <div className={styles.latest_post_row_item_desc}>
            {description}
          </div>
        )}
        
        <div className={styles.latest_post_row_item_tags}>
          {tags &&
            tags.slice(0, 2).map(({ label, permalink: tagPermalink }, i) => (
              <Link key={i} to={tagPermalink} className={styles.tag}>
                {label}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function LatestPosts() {
  // 💡 重要提醒：你的 JSON 檔案中必須包含 "image" 屬性
  return (
    <section className={styles.latestPosts}>
      <div className={styles.columnsContainer}>
        {/* 左欄：最新部落格 */}
        <div className={`${styles.column} ${styles.leftColumn}`}>
          <h1 className={styles.title}>生活貼文</h1>

          <div className={styles.latest_post_row}>
            {latestBlogPostList.slice(0,3).map((props, idx) => (
              // 修正：將 image 屬性傳遞給 Post 元件
              <Post key={idx} {...props} image={props.image} />
            ))}
          </div>
          <div className={styles.moreButtonContainer}>
            <Link className={styles.moreButton} to="/blog">
              查看所有貼文 →
            </Link>
          </div>
        </div>

        {/* 右欄：最新筆記 */}
        <div className={styles.column}>
          <h1 className={styles.title}>深度筆記</h1>
          <div className={styles.latest_post_row}>
            {latestDocsList.slice(0,3).map((props, idx) => (
              // 修正：將 image 屬性傳遞給 Post 元件
              <Post key={idx} {...props} image={props.image} />
            ))}
          </div>
          <div className={styles.moreButtonContainer}>
            <Link className={styles.moreButton} to="/docs/intro">
              查看所有筆記 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}