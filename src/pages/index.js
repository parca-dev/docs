import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import HomepageQuickstart from '../components/HomepageQuickstart';
import JoinCommunity from '../components/JoinCommunity';

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
        <HomepageQuickstart />
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
        <div className="container" style={{ marginTop: 50, marginBottom: 100, textAlign: 'center' }}>
            <h1>Open Source</h1>
            <p>Parca is 100% open source. All components are available under the <Link to="https://www.apache.org/licenses/LICENSE-2.0">Apache 2 License</Link> on <Link to="https://github.com/parca-dev">GitHub</Link>.</p>
        </div>
        <JoinCommunity />
        <div className="container" style={{ marginTop: 100, marginBottom: 100, textAlign: 'center', fontSize: 24 }}>
            <p>Parca was originally created by <Link to="https://polarsignals.com">Polar Signals, Inc.</Link></p>
        </div>
      </main>
    </Layout>
  );
}
