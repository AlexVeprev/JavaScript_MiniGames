module.exports = function(grunt) {
  var path = {src:   'src/',
              build: 'build/',
              js:    'js/*.js',
              html:  '*.html',
              css:   'styles/*.css'}

  grunt.initConfig({
    jshint: {
      all: path.src + path.js,
    },
    uglify: {
      build: {
        files: [{
            expand: true,
            src:  path.js,
            dest: path.build,
            cwd:  path.build
        }]
      }
    },
    copy: {
      build: {
        files: [{
            expand: true,
            src: [path.html, path.css],
            dest: path.build,
            cwd:  path.src
        }]
      }
    },
    strip_code: {
      options: {
        start_comment: "test-code",
        end_comment: "end-test-code",
      },
      your_target: {
        expand: true,
        src:  path.js,
        dest: path.build,
        cwd:  path.src
    }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-strip-code');

  grunt.registerTask('default', ['jshint', 'strip_code', 'uglify', 'copy']);
  grunt.registerTask('build', 'default');
};