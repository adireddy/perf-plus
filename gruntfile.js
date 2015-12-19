module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		haxe: {
			project: {
				hxml: "build.hxml"
			}
		},

        browserify: {
            pack: {
                src: ["dist/perf-plus.js", "libs/dat.gui.js"],
                dest: "dist/perf-plus.js",
            }
        },

		uglify: {
			options: {
				compress: {
					drop_console: true
				}
			},
			target: {
				files: {
					"dist/perf-plus.min.js": ["dist/perf-plus.min.js", "libs/dat.gui.js"]
				}
			}
		},

		exec: {
            copy: "mkdir npm-publish || true && cp -r src dist assets package.json LICENSE README.md ./npm-publish/",
			npm: "npm publish ./npm-publish/ && rm -r npm-publish"
		},

		zip: {
			"perf.zip": ["src/**", "extraParams.hxml", "haxelib.json", "README.md", "LICENCE"]
		}
	});

	grunt.loadNpmTasks("grunt-haxe");
    grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-zip");
	grunt.loadNpmTasks("grunt-exec");
	grunt.registerTask("default", ["haxe", "uglify"]);
};