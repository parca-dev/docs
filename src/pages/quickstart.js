import React from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import Quickstart from "../components/Quickstart";

const SvgLogo = require("../../static/img/logo.svg").default;

function Header() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">How to get started with Parca</h1>
        <p className="hero__subtitle">
          Please select your environment and use the following commands to
          quickly get started
        </p>
        <Quickstart />
      </div>
    </header>
  );
}

export default function QuickstartPage() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Open Source infrastructure-wide continuous profiling`}
      description="Open Source infrastructure-wide continuous profiling"
    >
      <Header />
      <main>
        <div
          className="container"
          style={{ marginTop: 50, marginBottom: 100, textAlign: "center" }}
        >
          <p>
            The easiest way to get started with Parca is either obtain the
            binary or the container. You can download the latest release of the
            binary from the Parca GitHub release pages (
            <Link to="https://github.com/parca-dev/parca/releases">
              Server
            </Link> and <Link to="https://github.com/parca-dev/parca-agent/releases">
               Agent
            </Link>
            ). Alternatively, you can use the Parca container image from
            <Link to="https://github.com/orgs/parca-dev/packages">
              the GitHub Container Registry.
            </Link>
          </p>
          <p>
            Once you have either the binary or the container, you can start
            profiling your applications with Parca.
          </p>
          <Link to="/docs/overview"> Check out our tutorials for more. </Link>

          <br />
          <br />
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/overview"
            >
              Documentation
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
