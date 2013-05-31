module.exports = function(grunt) {
	"use strict";

	function createBanner() {
		return [
			'/*!<%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("isoDate") %>'
			, ' * Homepage <%= pkg.homepage ? pkg.homepage : "" %>'
			, ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;'
			, ' * Description <%= pkg.description %>'
			, ' * Require <%= pkg.require ? pkg.require.join(" ") : "" %>'
		].concat(Array.prototype.splice.call(arguments, 0, arguments.length), '**/\n\n').join('\n');
	}

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Init
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			normal: {
				options: {
					banner: createBanner()
				},
				files: [
					{ dest: 'dist/<%= pkg.name %>.js', src: ['src/zeroclipboard.js', 'src/app.js']}
				]
			}
		},
		uglify: {
			normal: {
				files: [
					{ dest: 'dist/<%= pkg.name %>.min.js', src: ['dist/<%= pkg.name %>.js']}
				]
			}
		},
		jshint: {
			normal: {
				options: {
					jshintrc: 'dist/.jshintrc'
				},
				files: {
					src: ['dist/<%= pkg.name %>.js']
				}
			}
		},
		compress: {
			normal: {
				options: {
					archive: '<%= pkg.name %>.zip',
					mode: 'zip'
				},
				files: [
					{src: ['./**'], dest: ''}
				]
			}
		},
		watch: {
			normal: {
				files: ['src/*.js'],
				tasks: ['test']
			},
			release: {
				files: ['Gruntfile.js'],
				tasks: ['test', 'push']
			}	
		}
	});

	// Run task
	grunt.registerTask('test', ['concat', 'uglify', 'jshint']);
	grunt.registerTask('push', ['compress']);
	grunt.registerTask('default', ['test', 'push', 'watch']);
};