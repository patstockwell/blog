const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const scss = require('metalsmith-sass');
const collections = require('metalsmith-collections');
const handlebars = require('handlebars');
const dateFormatter = require('metalsmith-date-formatter');
const inlineCss = require('metalsmith-inline-css');
const highlight = require('highlight.js');
// TODO: RSS feeds
// TODO: word count - https://github.com/majodev/metalsmith-word-count

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
  // .use((x) => {
  //   console.log(x['posts/hello-world.md'].contents);
  //   return x;
  // })
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
      return highlight.highlightAuto(code).value;
    },
  }))
  .use(permalinks({
    pattern: ':slug',
    relative: false,
    duplicatesFail: true,
  }))
  .use(layouts({
    engine: 'handlebars',
    partials: {
      header: 'partials/header',
      head: 'partials/head'
    },
  }))
  .use(inlineCss())
  .build(function(err) {
    if (err) { throw err; }
  });
