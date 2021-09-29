import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import styles from './HomepageQuickstart.module.css';
import {usePluginData} from '@docusaurus/useGlobalData';
// import gettingStartedSimple from '!!raw-loader!./gettingStartedSimple.bash';
// import gettingStartedMinikube from '!!raw-loader!./gettingStartedMinikube.bash';

export default function HomepageQuickstart() {
    const [mode, setMode] = useState('binary');
    const [binaryMode, setBinaryMode] = useState('server');
    const {versions} = usePluginData('docusaurus-github-releases-plugin');

    const curlInstructions = {
        "server": `curl -sL https://github.com/parca-dev/parca/releases/download/${versions.server}/parca_${versions.server}_\`uname -s\`_\`uname -m\`.tar.gz | tar xvfz\n./parca`,
        "agent": `curl -sL https://github.com/parca-dev/parca-agent/releases/download/${versions.agent}/parca-agent_${versions.agent}_\`uname -s\`_\`uname -m\`.tar.gz | tar xvfz\n./parca-agent`
    }[binaryMode]

    const kubernetesInstructions = {
        "server": `kubectl apply -f https://github.com/parca-dev/parca/releases/download/${versions.server}/manifest.yaml`,
        "agent": `kubectl apply -f https://github.com/parca-dev/parca-agent/releases/download/${versions.agent}/kubernetes-manifest.yaml`
    }

    const minikubeInstructions = `# Minikube needs to be configured with a real virtual machine driver\nminikube start --driver=virtualbox\n# Use to deploy Parca Server (API and UI)\n${kubernetesInstructions.server}\n# Use to deploy Parca Agent for all nodes\n${kubernetesInstructions.agent}`
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
                                className={`button button--lg button--outline ${styles.buttonGroupButton} ${ binaryMode == 'server' ? 'button--warning button--active' : 'button--secondary' }`}
                                onClick={() => setBinaryMode('server')}
                            >Server</button>
                            <button
                                style={{ marginLeft: 10 }}
                                className={`button button--lg button--outline ${styles.buttonGroupButton} ${ binaryMode != 'server' ? 'button--warning button--active' : 'button--secondary' }`}
                                onClick={() => setBinaryMode('agent')}
                            >Agent</button>
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
