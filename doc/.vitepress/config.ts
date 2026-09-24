import { defineConfig } from "vitepress";

// The docs are plain markdown that also has to read well on GitHub, so the
// source stays in doc/ and VitePress reads it in place. Nothing here changes the
// published package — vitepress is a devDependency.
export default defineConfig({
  title: "Stepflow",
  description: "Product tours and onboarding walkthroughs for React",
  lang: "en-US",
  base: "/Stepflow/",
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: "/Stepflow/favicon.svg" }],
    ["meta", { property: "og:title", content: "Stepflow — product tours for React" }],
    [
      "meta",
      {
        property: "og:description",
        content: "One component, 3.2 kB min+gzip, no runtime dependencies.",
      },
    ],
  ],

  markdown: {
    config(md) {
      // VitePress marks fenced blocks v-pre but not inline code, so a span like
      // `overlay={{ closeOnClick: true }}` — ordinary JSX in React docs — is
      // parsed as a Vue interpolation and breaks the build. Opt every inline
      // code span out of interpolation instead of escaping braces in prose.
      // MIGRATION.md, CHANGELOG.md and friends live at the repo root so GitHub
      // finds them, and docs:prepare stages copies into doc/. Links written for
      // GitHub therefore carry one ../ too many for the site — drop one level
      // here so the same markdown is correct in both places.
      const ROOT_DOC = /^((?:\.\.\/)+)(MIGRATION|CHANGELOG)\.md(#.*)?$/;
      const linkOpen = md.renderer.rules.link_open;
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const href = token.attrGet("href");
        const match = href && ROOT_DOC.exec(href);
        if (match) {
          const up = match[1].slice(3) || "./";
          token.attrSet("href", `${up}${match[2]}.md${match[3] ?? ""}`);
        }
        return linkOpen
          ? linkOpen(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options);
      };

      const original = md.renderer.rules.code_inline;
      md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        const rendered = original
          ? original(tokens, idx, options, env, self)
          : `<code>${md.utils.escapeHtml(tokens[idx].content)}</code>`;
        return rendered.replace(/^<code(?=[\s>])/, "<code v-pre");
      };
    },
  },

  themeConfig: {
    logo: "/favicon.svg",
    outline: [2, 3],

    nav: [
      { text: "Guide", link: "/getting-started/quick-start" },
      { text: "API", link: "/api/" },
      { text: "Examples", link: "/examples/hello-world" },
      // Relative so it resolves in local preview and on Pages alike.
      { text: "Demo", link: "/demo/", target: "_self" },
      {
        text: "v2",
        items: [
          { text: "Changelog", link: "/CHANGELOG" },
          { text: "Migrating from 1.x", link: "/MIGRATION" },
          {
            text: "npm",
            link: "https://www.npmjs.com/package/@mohamedelghandour/stepflow",
          },
        ],
      },
    ],

    sidebar: [
      {
        text: "Getting started",
        collapsed: false,
        items: [
          { text: "Installation", link: "/getting-started/installation" },
          { text: "Quick start", link: "/getting-started/quick-start" },
        ],
      },
      {
        text: "Core concepts",
        collapsed: false,
        items: [
          { text: "Mental model", link: "/core-concepts/mental-model" },
          { text: "Steps and targets", link: "/core-concepts/steps-and-targets" },
          { text: "Positioning and overlay", link: "/core-concepts/positioning-and-overlay" },
        ],
      },
      {
        text: "Features",
        collapsed: false,
        items: [
          { text: "Steps", link: "/features/steps/overview" },
          { text: "Tooltip", link: "/features/tooltip/overview" },
          { text: "Navigation", link: "/features/navigation/overview" },
          { text: "Progress indicator", link: "/features/progress-indicator/overview" },
          { text: "Overlay and highlight", link: "/features/overlay-and-highlight/overview" },
        ],
      },
      {
        text: "Guides",
        collapsed: false,
        items: [
          { text: "Configuration", link: "/guides/configuration" },
          { text: "Styling and theming", link: "/guides/styling-and-theming" },
          { text: "Accessibility", link: "/guides/accessibility" },
        ],
      },
      {
        text: "Examples",
        collapsed: false,
        items: [
          { text: "Hello world", link: "/examples/hello-world" },
          { text: "Common recipes", link: "/examples/common-recipes" },
          { text: "Advanced recipes", link: "/examples/advanced-recipes" },
        ],
      },
      {
        text: "API reference",
        collapsed: false,
        items: [
          { text: "Overview", link: "/api/" },
          { text: "<Stepflow />", link: "/api/stepflow" },
          { text: "useTour", link: "/api/use-tour" },
        ],
      },
      {
        text: "Contributing",
        collapsed: true,
        items: [
          { text: "Architecture", link: "/developers/architecture" },
          { text: "Building", link: "/developers/building" },
          { text: "Contributing", link: "/developers/contributing" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/MohamedElGhandour/Stepflow" }],

    search: { provider: "local" },

    editLink: {
      pattern: "https://github.com/MohamedElGhandour/Stepflow/edit/main/doc/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "© 2025–present Mohamed Elghandour",
    },
  },
});
