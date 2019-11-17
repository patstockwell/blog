const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
// TODO: RSS feeds

Metalsmith(__dirname)
  .metadata({
    title: 'Harder Better Faster Fitter',
    description: 'Blog for hbff. Posts about gym, fitness, javascript, web apps, and hacking.',
    siteUrl: 'https://blog.harderbetterfasterfitter.com',
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(markdown({
    highlight: function(code) {
      return require('highlight.js').highlightAuto(code).value;
    },
  }))
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars'
  }))
  .build(function(err) {
    if (err) { throw err; }
  });
