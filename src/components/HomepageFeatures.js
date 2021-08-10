import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [
  {
    title: 'eBPF Profiler',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
          A single profiler, using <Link to="https://ebpf.io/">eBPF</Link>, automatically discovering targets from <Link to="https://kubernetes.io/">Kubernetes</Link> or <Link to="https://systemd.io/">SystemD</Link> across the entire infrastructure. Supports C, C++, Rust, Go, and more!
      </>
    ),
  },
  {
    title: 'Optimized Storage & Querying',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Efficiently storing profiling data while retaining raw data and allowing slicing and dicing of data through a label-based search. Aggregate profiling data infrastructure wide, view single profiles in time or compare on any dimension.
      </>
    ),
  },
  {
    title: 'Open Standards',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Both producing <Link to="https://github.com/google/pprof">pprof</Link> formatted profiles with the eBPF based profiler, and ingesting any pprof formatted profiles allowing for wide language adoption and interoperability with existing tooling.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
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
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row">
              <div class="col col--6" style={{textAlign: 'center'}}><span style={{ fontSize: 144 }}>$</span></div>
              <div class="col col--6">Save money on your cloud bill by reducing unnecessary resource usage.</div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row">
              <div class="col col--6">Improve performance systematically.</div>
              <div class="col col--6" style={{textAlign: 'center'}}><span style={{ fontSize: 72 }}>*graph going upwards*</span></div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row">
              <div class="col col--6" style={{textAlign: 'center'}}><span style={{ fontSize: 144 }}>*alert*</span></div>
              <div class="col col--6">Understand behavior of processes during and after incidents.</div>
            </div>
          </div>
        </section>
      </>
  );
}
