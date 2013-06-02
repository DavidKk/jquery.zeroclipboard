module.exports = function(grunt) {
	"use strict";

	function createBanner() {
		return [
			'/*!<%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("isoDate") %>'
			, ' * Homepage <%= pkg.homepage ? pkg.homepage : "" %>'
			, ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;'
			, ' * Description <%= pkg.description %>'
			, ' * Require <%= pkg.require ? pkg.require.join(" ") : "" %>'
			, ' *'
			, ' * 能够绑定 selector, 每次 createElement 时都会拥有该方法, 不用重复绑定'
 			, ' * $.fn.copy 即可调用, 但是必须点击才能触发复制 因为不点击会禁止'
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
					{
						dest: 'dist/<%= pkg.name %>.js', src: [
							'src/wrap-begin.js',
							'src/options.js',
							'src/zeroclipboard.js',
							'src/app.js',
							'src/wrap-end.js'
						]
					}
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