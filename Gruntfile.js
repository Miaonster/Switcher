module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nwpkg: grunt.file.readJSON('src/package.json'),

    jshint: {
      options: { // example directives
        curly: true,
        eqeqeq: true,
        browser: true,
        scripturl: true,
        undef: true,
        unused: true,
        onevar: true,
        strict: true,
        globals: { // array of pre-defined globals
          '$': true,
          'win': true,
          'jQuery': true,
          'define': true,
          'G': true,
          'form': true,
          'air': true
        },

        ignores: [ ],

        reporter: 'checkstyle',
        reporterOutput: 'out/checkstyle.xml'
      },
      all: [
        'src/**/*.js'
      ]
    },

    less: {
        main: {
            options: {
                paths: ["src/less"]
            },
            files: {
                "src/css/style.css": "src/less/style.less"
            }
        }
    },

    watch: {
      main: {
        files: ["src/less/**"],
        tasks: ["less:main"]
      }
    },

    nodewebkit: {
      options: {
        app_name: 'Switcher',
        app_version: '1.0.3',
        build_dir: './webkitbuilds',
        mac: true,
        mac_icns: 'asset/app.icns',
        zip: true,
        win: true,
        linux32: false,
        linux64: false
      },
      src: ['./src/**/*']
    },

    zip: {
      mac: {
        cwd: 'webkitbuilds/releases/Switcher/mac/',
        src: ['webkitbuilds/releases/Switcher/mac/Switcher.app/**/*'],
        dest: 'build/<%= nwpkg.name %>-<%= nwpkg.version %>-mac.zip',
        compression: 'DEFLATE',
      },
      win: {
        cwd: 'webkitbuilds/releases/Switcher/win/',
        src: ['webkitbuilds/releases/Switcher/win/Switcher/**/*'],
        dest: 'build/<%= nwpkg.name %>-<%= nwpkg.version %>-win.zip',
        compression: 'DEFLATE',
      }
    }

    //copy: {
    //  main: {
    //    files: [
    //      {
    //        expand: true,
    //        cwd: 'src/',
    //        src: ['**'],
    //        dest: 'build/'
    //      }
    //    ]
    //  }
    //}


  });

  //grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-zip');

  grunt.registerTask('build', ['less:main']);
};
