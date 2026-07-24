import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import LatestPosts from "../components/LatestPosts";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={"HomepageBanner"}>
      <div className={"ContentContainer"}>
        <Heading as="h1" className={"HomepageTitle"}>
          {siteConfig.title}
        </Heading>
        <p className={"HomepageTagline"}>
          我的生活與想法
        </p>

        <div className={"HomepageButtonContainer"}>
          <Link
            className="button button--secondary button--lg"
            to="/about">
            About
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`TzuChun.Blog：生活貼文|深度筆記|想法碎片`}
      description="TzuChun.Blog - 整理生活、紀錄學習與放置想法的地方">
      <HomepageHeader />
      <main>
        <LatestPosts />
      </main>
    </Layout>
  );
}
