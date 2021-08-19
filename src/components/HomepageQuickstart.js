import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import styles from './HomepageQuickstart.module.css';
import gettingStartedSimple from '!!raw-loader!./gettingStartedSimple.bash';
import gettingStartedMinikube from '!!raw-loader!./gettingStartedMinikube.bash';

export default function HomepageQuickstart() {
    const [mode, setMode] = useState('binary');

    const snippet = mode == 'binary' ? gettingStartedSimple : gettingStartedMinikube;
    const link = mode == 'binary' ? '/docs/binary' : '/docs/kubernetes';
    const text = mode == 'binary' ? 'Parca from Binary - Tutorial 5min ⏱️' : 'Parca in Kubernetes - Tutorial 5min ⏱️';

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col col--12">
                        <div>
                            <button
                                className={`button button--lg button--outline ${styles.buttonGroupButton} ${ mode == 'binary' ? 'button--warning button--active' : 'button--secondary' }`}
                                onClick={() => setMode('binary')}
                            >Binary</button>
                            <button
                                style={{ marginLeft: 10 }}
                                className={`button button--lg button--outline ${styles.buttonGroupButton} ${ mode != 'binary' ? 'button--warning button--active' : 'button--secondary' }`}
                                onClick={() => setMode('kubernetes')}
                            >Kubernetes</button>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'left', marginTop: 20 }}>
                    <div className="row">
                        <div className="col col--8 col--offset-2">
                            <CodeBlock className="language-bash">{snippet}</CodeBlock>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <Link
                    className="button button--secondary button--lg"
                    to={link}>
                    {text}
                </Link>
            </div>
        </>
    )
}
