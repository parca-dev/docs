const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Parca',
  tagline: 'Open Source Infrastructure-wide continuous profiling',
  url: 'https://parca.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  scripts: [{src: 'https://plausible.io/js/plausible.js', async: true, defer: true, 'data-domain': 'parca.dev'}],
  plugins: [
    require.resolve("./docusaurus-github-releases-plugin/src/index.js"),
  ],
  themeConfig: {
    announcementBar: {
      id: 'github_star',
      content: '★ <a href="https://github.com/parca-dev/parca">If you like Parca, give it a star on GitHub!</a> ★',
      backgroundColor: '#64b5f6', // Defaults to `#fff`.
      textColor: '#091E42', // Defaults to `#000`.
      isCloseable: true, // Defaults to `true`.
    },
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      logo: {
        alt: 'Parca Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
         type: 'doc',
         docId: 'overview',
         position: 'left',
         label: 'Documentation',
        },
        {
          type: 'doc',
          docId: 'binary',
          position: 'left',
          label: 'Tutorial',
         },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/parca-dev/parca',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://twitter.com/ParcaDev',
          label: 'Twitter',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Overview',
              to: '/docs/overview',
            },
            {
              label: 'FAQ',
              to: '/docs/faq',
            },
            {
              label: 'Parca from Binary',
              to: '/docs/binary',
            },
            {
              label: 'Parca in Kubernetes',
              to: '/docs/kubernetes',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            //{
            //  label: 'Stack Overflow',
            //  href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            //},
            {
              label: 'Discord',
              href: 'https://discord.gg/ZgUpYgpzXy',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/ParcaDev',
            },
          ],
        },
        {
          title: 'More',
          items: [
            //{
            //  label: 'Blog',
            //  to: '/blog',
            //},
            {
              label: 'GitHub',
              href: 'https://github.com/parca-dev/parca',
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
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/parca-dev/parca.dev/edit/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/parca-dev/parca.dev/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
