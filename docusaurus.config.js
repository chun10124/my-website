// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// ===== RSS/Atom 發文時間修正 =====
// 只有日期、沒寫時間的文章，Docusaurus 內建會標成 UTC 午夜（= 台北早上 8:00），
// 害文章在讀者的「Today」分頁提早過期。這裡統一改成「台北當天晚上 21:00」，
// 和 src/bin/generateFullRSS.js 使用同一套規則。
function taipeiDateOnly(y, m, d) {
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return new Date(`${y}-${mm}-${dd}T21:00:00+08:00`);
}

function correctFeedDate(post) {
  // 1. 檔名 YYYY-M-D-x.md（容許單位數月/日）
  const base = String(post?.metadata?.source || '').split('/').pop() || '';
  const m = base.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return taipeiDateOnly(m[1], m[2], m[3]);
  // 2. 沒有檔名日期時，若原日期剛好落在 UTC 午夜，視為「只有日期」→ 補台北 21:00
  const d = post?.metadata?.date ? new Date(post.metadata.date) : null;
  if (d && !isNaN(d) && d.toISOString().endsWith('T00:00:00.000Z')) {
    return taipeiDateOnly(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  return null; // 作者已寫明確時間 → 保持原值
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TzuChun.Blog',
  tagline: '我的生活與想法',
  favicon: '/img/icon.logo.jpg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://tzuchun.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'chun10124', // Usually your GitHub org/user name.
  projectName: 'my-website', // Usually your repo name.

  onBrokenLinks: 'throw',
  deploymentBranch: 'gh-pages',
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-TW',  // 預設語言是繁體中文
    locales: ['zh-TW'], // 目前只有中文版（英文版尚無翻譯內容，先移除）
    localeConfigs: {
      'zh-TW': {
      label: '繁體中文',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
            //'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            // 修正 date-only 文章的發文時間（台北 21:00），對 /blog/rss.xml 與 /blog/atom.xml 生效
            createFeedItems: async ({blogPosts, defaultCreateFeedItems, ...rest}) => {
              const items = await defaultCreateFeedItems({blogPosts, ...rest});
              return items.map((item, i) => {
                const corrected = correctFeedDate(blogPosts[i]);
                return corrected ? {...item, date: corrected} : item;
              });
            },
          },
          blogSidebarCount: 'ALL',      // 顯示所有文章
          blogSidebarTitle: '所有貼文', // 可自訂側邊欄標題
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'snippets', 
        path: 'snippets', 
        routeBasePath: 'snippets',

        blogSidebarTitle: '所有想法碎片',
        showReadingTime: true,
        blogSidebarCount: 'ALL', // 側邊欄顯示所有文章
      },
    ],

    [
    require.resolve('@easyops-cn/docusaurus-search-local'),
    {
      hashed: true,
      language: ['zh', 'en'], // 中文一定要含 'zh'
      highlightSearchTermsOnTargetPage: true,
    },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/icon.logo.JPG',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'TzuChun.Blog',
        logo: {
          alt: 'My Site Logo',
          src: '/img/icon.logo.JPG',
        },
        items: [
          
          {to: '/blog', label: '生活貼文', position: 'left'},
          
          {
            type: 'docSidebar',
            sidebarId: 'notesSidebar',
            position: 'left',
            label: '深度筆記',
          },

          {
            // 這是您的新連結
            to: '/snippets', 
            label: '想法碎片', 
            position: 'left',
          },

          {
            type: 'search', 
            position: 'right', // 通常放在右邊
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: '深度筆記',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: '我的聯絡信箱',
                href: 'mailto:tzuchun11232004@gmail.com',
              },
              {
                label: 'Docusaurus 官網',
                href: 'https://docusaurus.io',
              },
              {
                label: 'Facebook',
                href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              },
            ],
          },
          {
            title: 'More',
            items: [

              {
                label: 'RSS 訂閱',
                href: 'https://tzuchun.com/rss.xml',
},
              {
                label: 'Blog',
                to: '/blog',
              },

              {
                label: '想法碎片',
                to: '/snippets',
              },

              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} TzuChun Chao`,
      },

      metadata: [
        {
          name: 'docusaurus_tag', // 這是 Docusaurus 搜尋功能需要的識別碼
          content: 'search_enabled', // 告訴 Docusaurus 啟用搜尋
        },
      ],

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
