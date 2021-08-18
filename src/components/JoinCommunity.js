import React from 'react';
import Link from '@docusaurus/Link';
import styles from './JoinCommunity.module.css';

import Discord from '../../static/img/discord.svg';
import Slack from '../../static/img/slack.svg';
import Meeting from '../../static/img/meeting.svg';
import GitHub from '../../static/img/github.svg';
import Twitter from '../../static/img/twitter.svg';

export default function JoinCommunity() {
    return (
        <div className="container" style={{ marginTop: 100, marginBottom: 100 }}>
            <div className="row">
                <div class="col col--12">
                    <div style={{ textAlign: 'center' }}>
                        <h1>Join the community!</h1>
                        <p>Join users and companies that are using Parca in production.</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div class="col col--12">
                    <div style={{ textAlign: 'center' }}>
                        <Link to='/docs/community'><a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }}>
                            <Meeting className={styles.communityButtonImage} /> Community Meetings
                        </a></Link>
                        <a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }} href="https://discord.gg/ZgUpYgpzXy">
                            <Discord className={styles.communityButtonImage} /> Discord
                        </a>
                        <a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }} href="https://cloud-native.slack.com/archives/C01BB0M6K1U">
                            <Slack className={styles.communityButtonImage} /> Slack
                        </a>
                        <a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }} href="https://github.com/parca-dev/parca/issues">
                            <GitHub className={styles.communityButtonImage} /> Issues
                        </a>
                        <a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }} href="https://twitter.com/ParcaDev">
                            <Twitter className={styles.communityButtonImage} /> Twitter
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
