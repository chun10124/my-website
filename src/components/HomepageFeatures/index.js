import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '為什麼要架個人網站？',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        受到「好和弦」筆者 Wiwi 的啟發，我決定將文章發佈在“自己的”個人網站上。
        這裡不受任何平台的限制，我也能隨意更改網站內容。
      </>
    ),
  },
  {
    title: '這裡會分享...',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        這裡會分享我的生活與任何想法。<br />
        不論是生活中的觀察、不限範圍的知識，<br />
        甚至簡短的一句感想，都可能出現。
      </>
    ),
  },
  {
    title: '加入自由的行列',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        如果你也想架設自己的個人網站，<br />
        可以使用「Docusaurus」，
        這裡就是用它架設的，跟我一起減少對社群平台的依賴吧！
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
