module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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

  grunt.registerTask('build', ['less:main']);
};
