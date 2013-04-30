module.exports = function(grunt) {
	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  uglify: {
		options: {
		  banner: '/*! <%= pkg.name %> v.<%=pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		},
		build: {
		  src: 'build/ipsumFly.js',
		  dest: 'build/ipsumFly.min.js'
		}
	  },
	  connect: {
		server: {
			options: {
				port: 3501,
				base: '.'
			}
		}
	  },
	   watch: {
		  scripts: {
			files: ['ipsumFly.js'],
			options: {
			  nospawn: true
			},
			tasks: []
		  }
		},
	  concat: {
		options: {
			separator: ';'
	  	},
		dist: {
		  src: ['src/ipsum.js', 'src/ipsumFly.js'],
		  dest: 'build/ipsumFly.js'
		}
	  }
	});

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('server', ['connect', 'watch']);
};