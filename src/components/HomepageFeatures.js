import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Link from '@docusaurus/Link';

import StorageSearch from '../../static/img/storage_search.svg';
import OpenBook from '../../static/img/open_book.svg';
import UpwardGraph from '../../static/img/graph.svg';
import Alert from '../../static/img/alert.svg';

const FeatureList = [
  {
    title: 'eBPF Profiler',
    link: '/docs/agent',
    image: <img className={styles.featureImage} src={require('@site/static/img/ebpf.png').default} />,
    description: (
      <>
          A single profiler, using <Link to="https://ebpf.io/">eBPF</Link>, automatically discovering targets from <Link to="https://kubernetes.io/">Kubernetes</Link> or <Link to="https://systemd.io/">SystemD</Link> across the entire infrastructure. Supports C, C++, Rust, Go, and more!
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
    link: '/docs/pprof',
    image: <OpenBook className={styles.featureImage} title="Open Standards" />,
    description: (
      <>
        Both producing <Link to="https://github.com/google/pprof">pprof</Link> formatted profiles with the eBPF based profiler, and ingesting any pprof formatted profiles allowing for wide language adoption and interoperability with existing tooling.
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

export default function HomepageFeatures() {
  return (
      <>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div class="col col--12" style={{textAlign: 'center'}}><h1>What is Parca?</h1></div>
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
        <section>
          <div className="container">
            <div className="row">
              <div class="col col--6" style={{textAlign: 'right'}}><span style={{ fontSize: 144 }}>$</span></div>
              <div class="col col--6">Save money on your cloud bill by reducing unnecessary resource usage.</div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row">
              <div class="col col--6" style={{textAlign: 'right'}}>Improve performance systematically.</div>
              <div class="col col--6" style={{textAlign: 'left'}}><UpwardGraph /></div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row">
                <div class="col col--6" style={{textAlign: 'right'}}><Alert style={{width: 200, height: 200}} /></div>
              <div class="col col--6">Understand behavior of processes during and after incidents.</div>
            </div>
          </div>
        </section>
      </>
  );
}
