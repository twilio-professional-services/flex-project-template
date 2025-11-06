// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { github: lightCodeTheme, dracula: darkCodeTheme } = require("prism-react-renderer").themes;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Flex Project Template",
  tagline: "Twilio Professional Services",
  favicon: "img/logos/flex.png",

  // Set the production url of your site here
  url: "https://twilio-professional-services.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/flex-project-template/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "twilio-professional-services", // Usually your GitHub org/user name.
  projectName: "flex-project-template", // Usually your repo name.
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/", // Serve the docs at the site's root
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
          //docsRouteBaseBath: "/",
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        toExtensions: ["html"],
      },
    ],
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        // Options here
        indexDocs: true,
        indexBlog: false,
        language: "en",
      },
    ],
    'docusaurus-plugin-sass'
  ],
  
  stylesheets: [
    'https://assets.twilio.com/public_assets/paste-fonts/1.5.1/fonts.css',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Flex Project Template",
        logo: {
          alt: "Twilio Flex Logo",
          src: "img/logos/flex.png",
        },
        items: [
          {
            href: "https://github.com/twilio-professional-services/flex-project-template",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Twilio Docs",
            items: [
              {
                label: "Twilio Flex Docs",
                href: "https://www.twilio.com/docs/flex",
              },
              {
                label: "Flex Developer Docs",
                href: "https://www.twilio.com/docs/flex/developer",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/twilio-professional-services/flex-project-template",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Twilio, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

  themes: ['@docusaurus/theme-mermaid'],
    // In order for Mermaid code blocks in Markdown to work,
    // you also need to enable the Remark plugin with this option
    markdown: {
      mermaid: true,
    },
};

module.exports = config;
