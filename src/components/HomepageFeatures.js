import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Link from '@docusaurus/Link';

import StorageSearch from '../../static/img/storage_search.svg';
import OpenBook from '../../static/img/open_book.svg';
import UpwardGraph from '../../static/img/graph.svg';
import Alert from '../../static/img/alert.svg';
import MoneyStack from '../../static/img/money_stack.svg';
import Prometheus from '../../static/img/prometheus.svg';

const FeatureList = [
  {
    title: 'eBPF Profiler',
    link: '/docs/parca-agent',
    image: <img className={styles.featureImage} src={require('@site/static/img/ebpf.png').default} />,
    description: (
      <>
          A single profiler, using eBPF, automatically discovering targets from Kubernetes or systemd across the entire infrastructure with very low overhead. Supports C, C++, Rust, Go, and more!
      </>
    ),
  },
  {
    title: 'Optimized Storage & Querying',
    link: '/docs/storage',
    image: <StorageSearch className={styles.featureImage} title="Optimized Storage & Querying" />,
    description: (
      <>
        Efficiently storing profiling data while retaining raw data and allowing slicing and dicing of data through a label-based search. Aggregate profiling data infrastructure wide, view single profiles in time or compare on any dimension.
      </>
    ),
  },
  {
    title: 'Open Standards',
    link: '/docs/concepts#pprof',
    image: <OpenBook className={styles.featureImage} title="Open Standards" />,
    description: (
      <>
        Both producing pprof formatted profiles with the eBPF based profiler, and ingesting any pprof formatted profiles allowing for wide language adoption and interoperability with existing tooling.
      </>
    ),
  },
];

function Feature({image, link, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <Link to={link}>
                <div className={styles.featureTile}>
                    <div className="text--center">
                        {image}
                    </div>
                    <div className="text--center padding-horiz--md">
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

const UseCaseList = [
    {
        title: 'Save Money',
        image: <MoneyStack className={styles.featureImage} title="Save Money" />,
        description: (
            <>
                Many organizations have 20-30% of resources wasted with easily optimized code paths. The Parca Agent aims to lower the entry bar by requiring 0 instrumentation for the whole infrastructure. Deploy in your infrastructure and get started!
            </>
        ),
    },
    {
        title: 'Improve Performance',
        image: <UpwardGraph className={styles.featureImage} title="Improve Performance" />,
        description: (
            <>
                Using profiling data collected over time, Parca can with confidence and statistical significance determine hot paths to optimize. Additionally it can show differences between any label dimension, such as deploys, versions, and regions.
            </>
        ),
    },
    {
        title: 'Understand Incidents',
        image: <Alert className={styles.featureImage} title="Understand Incidents" />,
        description: (
            <>
                Profiling data provides unique insight and depth into what a process executed over time. Memory leaks, but also momentary spikes in CPU or I/O causing unexpected behavior, is traditionally difficult to troubleshoot are a breeze with continuous profiling.
            </>
        ),
    },
];

function UseCase({image, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <div className={styles.featureTile}>
                <div className="text--center">
                    {image}
                </div>
                <div className="text--center padding-horiz--md">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
  return (
      <>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className="col col--12" style={{textAlign: 'center'}}><h1>What is Parca?</h1></div>
            </div>
            <div className="row">
                <div className="col col--6 col--offset-3" style={{ textAlign: 'justify'}}>
                  <p>
                      Parca is a continuous profiling project for applications and infrastructure. It helps you save money, improve performance and understand incidents better.
                  </p>
                  <p>
                      Continuous profiling is the act of taking <Link to="https://en.wikipedia.org/wiki/Profiling_(computer_programming)">profiles</Link> (such as CPU, Memory, I/O and more) of programs in a systematic way. Parca collects, stores and makes profiles available to be queried over time. It features a powerful multi-dimensional data model, storage and query engine specifically designed for profiling data. Find out more in the <Link to="/docs/overview">Overview</Link>.
                  </p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
                <div className={clsx('col col--4 col--offset-4')}>
                    <div className={styles.featureTile}>
                        <div className="text--center">
                            <Prometheus className={styles.featureImage} title="Prometheus" />
                        </div>
                        <div className="text--center padding-horiz--md">
                            <h3>Prometheus Native</h3>
                            <p>The configuration and querying experience has been specifically designed to combine naturally with existing <Link to="https://prometheus.io/">Prometheus</Link> setups. From configuration paradigms, over target discovery, to querying via arbitrary label-selectors.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className="col col--12" style={{textAlign: 'center'}}><h1>Why?</h1></div>
            </div>
          </div>
        </section>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {UseCaseList.map((props, idx) => (
                <UseCase key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </>
  );
}
