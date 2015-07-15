'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  var componentsExportList = ["scripts/vendor/lawnchair/{,*/}*.*", "components/jquery/jquery.min.js", "components/jquery-migrate/jquery-migrate.min.js", "components/angular/angular.min.js", "components/angular-bootstrap/ui-bootstrap.min.js", "components/angular-bootstrap/ui-bootstrap-tpls.min.js", "components/angular-sanitize/angular-sanitize.min.js", "components/angular-http-auth/src/http-auth-interceptor.js", "components/angular-resource/angular-resource.min.js", "components/angular-ui/build/*.{css,js}", "components/angular-ui/modules/directives/showhide/showhide.js", "components/angular-ui/modules/directives/showhide/*.{js,css}", "components/angular-ui-select2/*.{js,css}", "components/jquery-mobile/*.{css,png}", "components/jquery-ui/themes/start/{,*/}*.{js,gif,webp,png,jpg,css}", "components/jquery-ui/ui/minified/jquery-ui.custom.min.js", "components/jslidernav/slidernav-min.js", "components/jquery-mousewheel/jquery.mousewheel.js", "components/underscore/underscore-min.js", "components/jquery-mousewheel/jquery.mousewheel.js", "components/select2/*.{js,gif,webp,png,jpg,css}", "components/jquery.scrollTo/jquery.scrollTo.min.js", "components/slidernav/slidernav-min.js", "components/angular-ui-select2/src/select2.js"];

  grunt.loadNpmTasks('grunt-bower');

  try {
    yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
  } catch (e) {
  }

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: ['<%= yeoman.app %>/{,*/}*.html', '{.tmp-server,<%= yeoman.app %>}/styles/{,*/}*.css', '.tmp-server, {<%= yeoman.app %>}/scripts/{,*/}*.js', '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}', '<%= yeoman.app %>/fonts/{,*/}*.{svg,eot,ttf,otf}'],
        tasks: ['livereload']
      }
    },
    connect: {
      livereload: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, '.tmp-server'), mountFolder(connect, yeomanConfig.app)];
          }
        }
      },
      test: {
        options: {
          port: 9000,
          middleware: function (connect) {
            return [mountFolder(connect, '.tmp'), mountFolder(connect, 'test')];
          }
        }
      },
      e2e: {
        options: {
          port: 9000,
          hostname: 'localhost',
          middleware: function (connect) {
            return [mountFolder(connect, '.tmp-server'), mountFolder(connect, yeomanConfig.app)];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.livereload.options.port %>'
      }
    },
    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>'],
      server: '.tmp-server'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js']
    },
    karma: {
      dev: {
        configFile: 'karma.conf.js',
        singleRun: false,
        autoWatch: true,
        background: true
      },
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false
      },
      e2e: {
        configFile: 'karma-e2e.conf.js',
        singleRun: typeof grunt.option("debug") === 'undefined'
      }
    },
    coffee: {
      dist: {
        files: {
          '.tmp/scripts/coffee.js': '<%= yeoman.app %>/scripts/*.coffee'
        }
      },
      test: {
        files: [
          {
            expand: true,
            cwd: '.tmp/spec',
            src: '*.coffee',
            dest: 'test/spec'
          }
        ]
      }
    },
    compass: {
      dist: {
        options: {
          basePath: '<%= yeoman.dist %>',
          sassDir: 'styles',
          cssDir: 'styles',
          imagesDir: 'images',
          javascriptsDir: 'scripts',
          fontsDir: 'fonts',
          importPath: '<%= yeoman.dist %>/components',
          relativeAssets: true,
          force: true
        }
      },
      server: {
        options: {
          basePath: '<%= yeoman.app %>',
          sassDir: 'styles',
          cssDir: '../.tmp-server/styles',
          imagesDir: 'images',
          javascriptsDir: 'scripts',
          fontsDir: 'fonts',
          importPath: '<%= yeoman.app %>/components',
          relativeAssets: false,
          debugInfo: true
        }
      }
    },
    concat: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': ['.tmp/scripts/{,*/}*.js', '<%= yeoman.app %>/scripts/{,*/}*.js']
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': ['<%= yeoman.dist %>/styles/{,*/}*.css']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
           // https://github.com/yeoman/grunt-usemin/issues/44
           //collapseWhitespace: true,
           collapseBooleanAttributes: true,
           removeAttributeQuotes: true,
           removeRedundantAttributes: true,
           useShortDoctype: true,
           removeEmptyAttributes: true,
           removeOptionalTags: true*/
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['*.html', 'views/*.html'],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>/scripts',
            src: '*.js',
            dest: '<%= yeoman.dist %>/scripts'
          }
        ]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': ['<%= yeoman.dist %>/scripts/scripts.js'],
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: (['*.html', '*.js', 'views/{,*/}{,*/}*.html', 'styles/{,*}/*.{scss,css}', 'scripts/{,*}/{,*}/*.{js,json}', 'partials/{,*}/*.html', 'template/{,*}/*.html', '*.{ico,txt}', '.htaccess', 'components/**/*', 'images/{,*/}*.{gif,webp,png,jpg}', 'fonts/{,*/}*.{otf,ttf,svg,eot}']).concat(componentsExportList)
          }
        ]
      },
      localSandbox: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: (['*.html', '*.js', 'views/{,*/}{,*/}*.html', 'styles/{,*}/*.{scss,css}', 'scripts/{,*}/{,*}/*.{js,json}', 'partials/{,*}/*.html', 'template/{,*}/*.html', '*.{ico,txt}', '.htaccess', 'images/{,*/}*.{gif,webp,png,jpg}', 'fonts/{,*/}*.{otf,ttf,svg,eot}']).concat(componentsExportList)
          },
          {
            expand: true,
            cwd: 'deployments/' + (grunt.option('config') || 'localSandbox') + '/scripts',
            src: '*.{js,json}',
            dest: '<%= yeoman.dist %>/scripts/'
          }
        ]
      },
      server: {
        files: [
          {
            src: 'deployments/' + (grunt.option('config') || 'local') + '/scripts/config.js',
            dest: '.tmp-server/scripts/config.js'
          }
        ]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');
  // remove when mincss task is renamed
  grunt.renameTask('mincss', 'cssmin');

  grunt.registerTask('server', ['clean:server', 'compass:server', 'copy:server', 'livereload-start', 'connect:livereload', 'open', 'watch']);

  grunt.registerTask('test', ['clean:server', 'compass', 'connect:test', 'karma']);

  grunt.registerTask('e2e', ['clean:server', 'compass:server', 'copy:server', 'connect:e2e', 'karma:e2e']);

  grunt.registerTask('build', ['clean:dist', 'copy:dist', 'compass:dist', 'cssmin']);
  //grunt.registerTask('build', ['clean:dist', 'copy','compass:dist', 'useminPrepare', 'cssmin', 'concat',  'usemin', 'ngmin', 'uglify']);

  grunt.registerTask('sandbox', ['clean:dist', 'copy:localSandbox', 'compass:dist', 'cssmin']);

  grunt.registerTask('default', ['build']);
};
