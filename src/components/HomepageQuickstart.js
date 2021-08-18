import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import gettingStartedSimple from '!!raw-loader!./gettingStartedSimple.bash';
import gettingStartedMinikube from '!!raw-loader!./gettingStartedMinikube.bash';

export default function HomepageQuickstart() {
    const [mode, setMode] = useState('simple');

    const snippet = mode == 'simple' ? gettingStartedSimple : gettingStartedMinikube;

    return (
        <div className="container">
            <div className="row">
                <div class="col col--12">
                    <div>
                        <button
                            className={`button button--lg button--outline button--warning ${ mode == 'simple' ? 'button--active' : '' }`}
                            onClick={() => setMode('simple')}
                        >Simple</button>
                        <button
                            style={{ marginLeft: 10 }}
                            className={`button button--lg button--outline button--warning ${ mode != 'simple' ? 'button--active' : '' }`}
                            onClick={() => setMode('minikube')}
                        >Minikube</button>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'left', marginTop: 20 }}>
                <div className="row">
                    <div class="col col--8 col--offset-2">
                        <CodeBlock className="language-bash">{snippet}</CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    )
}
