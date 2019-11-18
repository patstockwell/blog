const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const scss = require('metalsmith-sass');
const collections = require('metalsmith-collections');
const handlebars = require('handlebars');
const dateFormatter = require('metalsmith-date-formatter');
const inlineCss = require('metalsmith-inline-css');
// TODO: RSS feeds

handlebars.registerHelper('links', function(items, options) {
  console.log('---------------------inside', items, options);
  return 'link';
});

Metalsmith(__dirname)
  .metadata({
    site: {
      title: 'Harder Better Faster Fitter',
      description: 'Blog for hbff. Posts about gym, fitness, javascript, web apps, and hacking.',
      siteUrl: 'https://blog.harderbetterfasterfitter.com',
    },
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(scss({
    outputDir: function(originalPath) {
      return originalPath.replace('scss', 'css');
    }
  }))
  .use(collections({
    articles: {
      pattern: ['posts/*.md', '**/!index.md'],
      sortBy: 'date',
      reverse: true
    },
  }))
  .use(dateFormatter({
    dates: [{
      key: 'date',
      format: 'MMM Do YYYY'
    }],
  }))
  .use(markdown({
    highlight: function(code) {
      return require('highlight.js').highlightAuto(code).value;
    },
  }))
  .use(permalinks({
    pattern: ':title',
  }))
  .use(layouts({
    engine: 'handlebars',
    partials: {
      header: 'partials/header',
      head: 'partials/head'
    },
  }))
  .use(inlineCss())
  // .use((x, ...rest) => {
  //   console.log(x, rest);
  //   return x;
  // })
  .build(function(err) {
    if (err) { throw err; }
  });
