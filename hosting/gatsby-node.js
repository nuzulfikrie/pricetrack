// Equivalent of gatsby-plugin-create-client-paths (Gatsby 4-only, incompatible
// with Gatsby 5's path-to-regexp) using the modern named-wildcard matchPath syntax.
exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

  if (page.matchPath || page.path.match(/dev-404-page/)) {
    return;
  }

  const path = page.path.match(/\/$/) ? page.path : `${page.path}/`;

  if (path.match(/^\/view\//)) {
    page.matchPath = '/view/:splat*';
    createPage(page);
  }
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /skylight/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
