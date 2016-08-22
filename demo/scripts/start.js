process.env.NODE_ENV = 'development';

var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var execSync = require('child_process').execSync;
var opn = require('opn');
var detect = require('./utils/detectPort');
var prompt = require('./utils/prompt');
var config = require('../config/webpack.config.dev');

// Tools like Cloud9 rely on this
var DEFAULT_PORT = process.env.PORT || 3000;
var compiler;

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
var handleCompile;
var isSmokeTest = process.argv.some(arg => arg.indexOf('--smoke-test') > -1);
if (isSmokeTest) {
  handleCompile = function (err, stats) {
    if (err || stats.hasErrors() || stats.hasWarnings()) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  };
}

var friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

// This is a little hacky.
// It would be easier if webpack provided a rich error object.

function formatMessage(message) {
  return message
    // Make some common errors shorter:
    .replace(
      // Babel syntax error
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      // Webpack file not found error
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '');
}

function clearConsole() {
  process.stdout.write('\x1bc');
}

function setupCompiler(port) {
  compiler = webpack(config, handleCompile);

  compiler.plugin('invalid', function() {
    clearConsole();
    console.info('Compiling...');
  });

  compiler.plugin('done', function(stats) {
    clearConsole();
    var hasErrors = stats.hasErrors();
    var hasWarnings = stats.hasWarnings();
    if (!hasErrors && !hasWarnings) {
      console.info(chalk.green('Compiled successfully!'));
      console.info();
      console.info('The app is running at http://localhost:' + port + '/');
      console.info();
      return;
    }

    var json = stats.toJson();
    var formattedErrors = json.errors.map(message =>
      'Error in ' + formatMessage(message)
    );
    var formattedWarnings = json.warnings.map(message =>
      'Warning in ' + formatMessage(message)
    );

    if (hasErrors) {
      console.info(chalk.red('Failed to compile.'));
      console.info();
      if (formattedErrors.some(isLikelyASyntaxError)) {
        // If there are any syntax errors, show just them.
        // This prevents a confusing ESLint parsing error
        // preceding a much more useful Babel syntax error.
        formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
      }
      formattedErrors.forEach(message => {
        console.info(message);
        console.info();
      });
      // If errors exist, ignore warnings.
      return;
    }

    if (hasWarnings) {
      console.info(chalk.yellow('Compiled with warnings.'));
      console.info();
      formattedWarnings.forEach(message => {
        console.info(message);
        console.info();
      });

      console.info('You may use special comments to disable some warnings.');
      console.info('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
      console.info('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
    }
  });
}

function openBrowser(port) {
  if (process.platform === 'darwin') {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      execSync('ps cax | grep "Google Chrome"');
      execSync(
        'osascript ' +
        path.resolve(__dirname, './utils/chrome.applescript') +
        ' http://localhost:' + port + '/'
      );
      return;
    } catch (err) {
      // Ignore errors.
    }
  }
  // Fallback to opn
  // (It will always open new tab)
  opn('http://localhost:' + port + '/');
}

function runDevServer(port) {
  new WebpackDevServer(compiler, {
    historyApiFallback: true,
    hot: true, // Note: only CSS is currently hot reloaded
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }).listen(port, (err, result) => {
    if (err) {
      return console.info(err);
    }

    clearConsole();
    console.info(chalk.cyan('Starting the development server...'));
    console.info();
    openBrowser(port);
  });
}

function run(port) {
  setupCompiler(port);
  runDevServer(port);
}

detect(DEFAULT_PORT).then(port => {
  if (port === DEFAULT_PORT) {
    run(port);
    return;
  }

  clearConsole();
  var question =
    chalk.yellow('Something is already running at port ' + DEFAULT_PORT + '.') +
    '\n\nWould you like to run the app at another port instead?';

  prompt(question, true).then(shouldChangePort => {
    if (shouldChangePort) {
      run(port);
    }
  });
});
