import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import CodeBlock from '@theme/CodeBlock';
import gettingStartedSource from '!!raw-loader!./gettingStarted.bash';

const SvgLogo = require('../../static/img/logo.svg').default;

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
            <SvgLogo style={{ width: 200 }} alt={siteConfig.title} />
        </h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="container">
          <div style={{ textAlign: 'left' }}>
            <div className="row">
              <div class="col col--8 col--offset-2">
                <CodeBlock className="language-bash">{gettingStartedSource}</CodeBlock>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Parca Tutorial - 5min ⏱️
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
      title={`${siteConfig.title} - Infrastructure-wide continuous profiling`}
      description="Infrastructure-wide continuous profiling">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
