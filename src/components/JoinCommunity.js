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
                <div className="col col--12">
                    <div style={{ textAlign: 'center' }}>
                        <h1>Join the community!</h1>
                        <p>Join users and companies that are using Parca in production.</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col col--12">
                    <div style={{ textAlign: 'center' }}>
                        <Link to='/docs/community' className={`button button--lg button--outline button--primary`}>
                            <Meeting id="meetingIcon" className={styles.communityButtonImage} /><span> Community Meetings</span>
                        </Link>
                        <a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }} href="https://discord.gg/ZgUpYgpzXy">
                            <Discord id="discordIcon" className={styles.communityButtonImage} /><span> Discord</span>
                        </a>
                        <a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }} href="https://cloud-native.slack.com/archives/C01BB0M6K1U">
                            <Slack id="slackIcon" className={styles.communityButtonImage} /><span> Slack</span>
                        </a>
                        <a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }} href="https://github.com/parca-dev/parca/issues">
                            <GitHub id="githubIcon" className={styles.communityButtonImage} /><span> Issues</span>
                        </a>
                        <a className={`button button--lg button--outline button--primary`} style={{ marginLeft: 10 }} href="https://twitter.com/ParcaDev">
                            <Twitter id="twitterIcon" className={styles.communityButtonImage} /><span> Twitter</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
