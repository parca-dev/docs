import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import styles from './HomepageQuickstart.module.css';
import gettingStartedSimple from '!!raw-loader!./gettingStartedSimple.bash';
import gettingStartedMinikube from '!!raw-loader!./gettingStartedMinikube.bash';
import {usePluginData} from '@docusaurus/useGlobalData';

export default function HomepageQuickstart() {
    const [mode, setMode] = useState('binary');
    const [binaryMode, setBinaryMode] = useState('linux');
    const {versions} = usePluginData('docusaurus-github-releases-plugin');

    const filename = {
        "linux": `parca_Linux_arm64.tar.gz`,
        "macos": `parca_Darwin_arm64.tar.gz`
    }[binaryMode]

    const curlInstructions = `curl -sL https://github.com/parca-dev/parca/releases/download/${versions.parca}/${filename} | tar xvfz\n./parca`
    const minikubeInstructions = `minikube start --driver=virtualbox # needs to be a real virtual machine driver\nkubectl apply -f https://raw.githubusercontent.com/parca-dev/parca/${versions.parca}/deploy/manifests/parca-deployment.yaml`

    const snippet = mode == 'binary' ? curlInstructions : minikubeInstructions;
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
                {mode == "binary" && (
                    <div className="row" style={{ marginTop: 20 }}>
                    <div className="col col--12">
                        <div>
                            <button
                                className={`button button--lg button--outline ${styles.buttonGroupButton} ${ binaryMode == 'linux' ? 'button--warning button--active' : 'button--secondary' }`}
                                onClick={() => setBinaryMode('linux')}
                            >Linux</button>
                            <button
                                style={{ marginLeft: 10 }}
                                className={`button button--lg button--outline ${styles.buttonGroupButton} ${ binaryMode != 'linux' ? 'button--warning button--active' : 'button--secondary' }`}
                                onClick={() => setBinaryMode('macos')}
                            >MacOS</button>
                        </div>
                    </div>
                </div>
                )}
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
