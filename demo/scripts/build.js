process.env.NODE_ENV = 'production';

var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var filesize = require('filesize');
var gzipSize = require('gzip-size').sync;
var rimrafSync = require('rimraf').sync;
var webpack = require('webpack');
var config = require('../config/webpack.config.prod');
var paths = require('../config/paths');

// Remove all content but keep the directory so that
// if you're in it, you don't end up in Trash
rimrafSync(paths.appBuild + '/*');

console.info('Creating an optimized production build...');
webpack(config).run(function(err, stats) {
  if (err) {
    console.error('Failed to create a production build. Reason:');
    console.error(err.message || err);
    process.exit(1);
  }

  console.info(chalk.green('Compiled successfully.'));
  console.info();

  console.info('File sizes after gzip:');
  console.info();
  var assets = stats.toJson().assets
    .filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      var fileContents = fs.readFileSync(paths.appBuild + '/' + asset.name);
      var size = gzipSize(fileContents);
      return {
        folder: path.join('build', path.dirname(asset.name)),
        name: path.basename(asset.name),
        size: size,
        sizeLabel: filesize(size)
      };
    });
  assets.sort((a, b) => b.size - a.size);

  var longestSizeLabelLength = Math.max.apply(null,
    assets.map(a => a.sizeLabel.length)
  );
  assets.forEach(asset => {
    var sizeLabel = asset.sizeLabel;
    if (sizeLabel.length < longestSizeLabelLength) {
      var rightPadding = ' '.repeat(longestSizeLabelLength - sizeLabel.length);
      sizeLabel += rightPadding;
    }
    console.info(
      '  ' + chalk.green(sizeLabel) +
      '  ' + chalk.dim(asset.folder + path.sep) + chalk.cyan(asset.name)
    );
  });
  console.info();

  var openCommand = process.platform === 'win32' ? 'start' : 'open';
  var homepagePath = require(paths.appPackageJson).homepage;
  if (homepagePath) {
    console.info('You can now publish them at ' + homepagePath + '.');
    console.info('For example, if you use GitHub Pages:');
    console.info();
    console.info('  git commit -am "Save local changes"');
    console.info('  git checkout -B gh-pages');
    console.info('  git add -f build');
    console.info('  git commit -am "Rebuild website"');
    console.info('  git filter-branch -f --prune-empty --subdirectory-filter build');
    console.info('  git push -f origin gh-pages');
    console.info('  git checkout -');
    console.info();
  } else {
    console.info('You can now serve them with any static server.');
    console.info('For example:');
    console.info();
    console.info('  npm install -g pushstate-server');
    console.info('  pushstate-server build');
    console.info('  ' + openCommand + ' http://localhost:9000');
    console.info();
    console.info(chalk.dim('The project was built assuming it is hosted at the root.'));
    console.info(chalk.dim('Set the "homepage" field in package.json to override this.'));
    console.info(chalk.dim('For example, "homepage": "http://user.github.io/project".'));
  }
  console.info();
});
