const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Parca",
  tagline: "Open Source Infrastructure-wide continuous profiling",
  url: "https://parca.dev",
  baseUrl: "/docs/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.svg",
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.
  scripts: [
    {
      src: "/_vercel/insights/script.js",
      async: true,
      defer: true,
    },
  ],
  plugins: [
    require.resolve("./docusaurus-github-releases-plugin/src/index.js"),
  ],
  themeConfig: {
    announcementBar: {
      id: "github_star",
      content:
        '★ <a href="https://github.com/parca-dev/parca">If you like Parca, give it a star on GitHub!</a> ★',
      backgroundColor: "#64b5f6", // Defaults to `#fff`.
      textColor: "#091E42", // Defaults to `#000`.
      isCloseable: true, // Defaults to `true`.
    },
    metadata: [{ name: "og:image", content: "https://parca.dev/img/logo.png" }],
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      logo: {
        alt: "Parca Logo",
        src: "img/logo.svg",
        href: "https://parca.dev/",
        target: "_self",
      },
      items: [
        {
          type: "doc",
          docId: "quickstart",
          position: "left",
          label: "Quick Start",
        },
        {
          type: "doc",
          docId: "overview",
          position: "left",
          label: "Documentation",
        },
        {
          type: "doc",
          docId: "binary",
          position: "left",
          label: "Tutorial",
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: "https://github.com/parca-dev/parca",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://twitter.com/ParcaDev",
          label: "Twitter",
          position: "right",
        },
        {
          href: "https://discord.gg/ZgUpYgpzXy",
          label: "Discord",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Overview",
              to: "/docs/overview",
            },
            {
              label: "FAQ",
              to: "/docs/faq",
            },
            {
              label: "Governance",
              to: "/docs/governance",
            },
          ],
        },
        {
          title: "Quick Start",
          items: [
            {
              label: "How to get started",
              to: "/quickstart",
            },
            {
              label: "Parca from Binary",
              to: "/docs/binary",
            },
            {
              label: "Parca from Snapcraft",
              to: "/docs/snap",
            },
            {
              label: "Parca in Kubernetes",
              to: "/docs/kubernetes",
            },
          ],
        },
        {
          title: "Community",
          items: [
            //{
            //  label: 'Stack Overflow',
            //  href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            //},
            {
              label: "Discord",
              href: "https://discord.gg/ZgUpYgpzXy",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/ParcaDev",
            },
            {
              label: "YouTube",
              href: "https://www.youtube.com/channel/UCRrqAGuajRqIX_E_arNnYCw",
            },
          ],
        },
        {
          title: "More",
          items: [
            //{
            //  label: 'Blog',
            //  to: '/blog',
            //},
            {
              label: "GitHub",
              href: "https://github.com/parca-dev/parca",
            },
            {
              html: `
                <a href="https://vercel.com/?utm_source=parca-dev&utm_campaign=oss" target="_blank" aria-label="Powered by Vercel">
                  <img src="/img/powered-by-vercel.svg" alt="Powered by Vercel" />
                </a>`,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Parca Project, Built with Docusaurus.`,
    },
    prism: {
      //theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    algolia: {
      apiKey: "525d17aaac0e93dea054f39af7b692bd",
      indexName: "parca",
      appId: "BH4D9OD16A",
      contextualSearch: false,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/parca-dev/parca.dev/edit/main/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
