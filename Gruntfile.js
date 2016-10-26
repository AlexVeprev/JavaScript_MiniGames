module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['js/*.js']
    },
    uglify: {
      build: {
        files: [{
            expand: true,
            src: ['js/*.js'],
            dest: 'build/'
        }]
      }
    },
    copy: {
      build: {
        files: [{
            expand: true,
            src: ['*.html', '*.css'],
            dest: 'build/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'uglify', 'copy']);
  grunt.registerTask('build', 'default');
};