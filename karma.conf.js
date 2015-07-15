// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/components/rosie/src/rosie.js',
  'node_modules/sinon/lib/sinon.js',
  'node_modules/sinon/lib/sinon/call.js',
  'node_modules/sinon/lib/sinon/spy.js',
  'node_modules/sinon/lib/sinon/stub.js',
  'node_modules/sinon/lib/sinon/match.js',
  'deployments/test/scripts/config.js',
  'app/components/jquery/jquery.js',
  'app/components/angular/angular.js',
  'app/components/underscore/underscore-min.js',
  'app/components/angular-ui/build/angular-ui.min.js',
  'app/components/angular-mocks/angular-mocks.js',
  'app/components/angular-bootstrap/ui-bootstrap.js',
  'app/scripts/vendor/lawnchair/Lawnchair.js',
  'app/scripts/vendor/lawnchair/adapters/dom.js',
  'app/scripts/vendor/lawnchair/plugins/callbacks.js',
  'app/scripts/vendor/lawnchair/plugins/query.js',
  'app/components/angular-http-auth/src/http-auth-interceptor.js',
  'app/scripts/vendor/hammer.js',
  'app/scripts/vendor/angular-hammer.js',
  'app/scripts/*.js',
  'test/mock/**/*.js',
  'test/factory/**/*.js',
  'app/scripts/controllers/**/*.js',
  'app/scripts/directives/**/*.js',
  'app/scripts/filters/**/*.js',
  //'app/scripts/i18n/**/*.js',
  'app/scripts/services/**/*.js',
  'app/scripts/models/**/*.js',
  'test/spec/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
