module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['*.js']
    },
    uglify: {
      build: {
        files: [{
            expand: true,
            src: '*.js',
            dest: 'build/scripts'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};