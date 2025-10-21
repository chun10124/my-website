import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.myCustomHeader}>
      <div className={styles.myContentContainer}>
        <Heading as="h1" className={styles.myTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.myTagline}>
          我的想法與生活
        </p>

        <div className={styles.myButtonContainer}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            閱讀最新文章
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
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
