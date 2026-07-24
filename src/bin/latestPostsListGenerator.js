const glob = require("glob");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

const blogPath = "./.docusaurus/docusaurus-plugin-content-blog/default";
const blogFilesPattern = "site-blog-*.json";
const latestBlogPostList = "./src/components/LatestPosts/latest-blog-posts.json";

const docsPath = "./.docusaurus/docusaurus-plugin-content-docs/default";
const docFilesPattern = "site-docs-*.json";
const latestDocsList = "./src/components/LatestPosts/latest-docs.json";

// 確保 components 資料夾存在
const componentsDir = path.dirname(latestBlogPostList);
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

generateLatestPostList(blogPath, blogFilesPattern, latestBlogPostList);
//console.log("[docs] CWD =", process.cwd());
//console.log("[docs] Primary pattern =", path.join(docsPath, docFilesPattern));

//console.log(
//  "[docs] Fallback matches (first 10):",
//  glob
//    .sync(".docusaurus/**/docusaurus-plugin-content-docs/**/site-docs-*.json", {
//      windowsPathsNoEscape: true,
//    })
//    .slice(0, 10)
//);

generateLatestPostList(docsPath, docFilesPattern, latestDocsList);

function generateLatestPostList(folderPath, filesPattern, outputPath) {
  let allItems = {};

  try {
    const blogFiles = glob.sync(path.join(folderPath, filesPattern));
    if (blogFiles.length === 0) {
      console.warn(
        `⚠️ 在 ${folderPath} 中找不到 ${filesPattern}，請先執行 'npm run start'。`
      );
    }

    blogFiles.map((file) => {
      const rawdata = fs.readFileSync(file);
      const item = JSON.parse(rawdata);

      if (item != null && item.draft !== true) {
        let dateVal =
          (item.frontMatter && item.frontMatter.date) ??
          item.date ??
          item.lastUpdatedAt;

        // 若為秒級整數，轉成毫秒
        if (typeof dateVal === "number" && dateVal < 1e12) dateVal = dateVal * 1000;
        if (!dateVal) return;

        item.date = new Date(dateVal).toISOString();

        // tags 防呆
        if (!Array.isArray(item.tags)) {
          item.tags =
            (item.frontMatter && Array.isArray(item.frontMatter.tags))
              ? item.frontMatter.tags
              : [];
        }

        // ✅ 改成英文日期格式
        const formattedDate = moment(item.date).format("DD MMM YYYY");
        
        allItems[item.date] = {
          title: item.title,
          permalink: item.permalink,
          description: item.description,
          tags: item.tags,
          date: item.date,
          
          // ✅ 關鍵清理：新增正確的格式化日期
          formattedDate: formattedDate, 

          // ✅ 圖片提取邏輯 (保持正確)
          image: (item.frontMatter && item.frontMatter.image) 
                ? item.frontMatter.image 
                : null,
        };
        
      }
    });

    const allIds = Object.keys(allItems);
    const latestIds = allIds.sort().reverse().slice(0, 5);
    const latestItems = latestIds.map((v) => allItems[v]);

    generateLatestFile(latestItems, outputPath);
    console.log(`✅ 成功生成最新文章列表: ${outputPath} (共 ${latestItems.length} 篇)`);
  } catch (error) {
    console.error(`❌ 生成失敗 (${outputPath}):`, error.message);
    generateLatestFile([], outputPath);
  }
}

function generateLatestFile(allPosts, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(allPosts, null, 2));
}
