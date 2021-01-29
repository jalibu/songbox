module.exports = function (grunt) {
    "use strict";

    let outDir = 'dist';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            installNPMPackages: {
                command: "yarn install"
            },
            start: {
                command: 'node ' + outDir + '/server/server.js'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/static_html',
                        src: ['**'],
                        dest: 'dist/static_html'
                    },
                    {
                        expand: true,
                        cwd: 'src/data',
                        src: ['**'],
                        dest: 'dist/data'
                    },
                    {
                        expand: true,
                        cwd: 'src/app/templates',
                        src: ['**'],
                        dest: 'dist/app/templates'
                    }
                ]
            }
        },
        ts: {
            default: {
                tsconfig: true
            }
        },
        tslint: {
            options: {
                configuration: 'tslint.json',
                rulesDirectory: 'node_modules/tslint-microsoft-contrib'
            },
            files: {
                src: ['src/**/*.ts', 'spec/**/*.ts']
            }
        },
        clean: [outDir],
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            run: ['nodemon', 'watch'],
            build: ['ts']
        },
        nodemon: {
            dev: {
                script: outDir + '/server/server.js',
                watch: [outDir],
                delay: 2000,
                ext: 'js',
                legacyWatch: true
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/static_html/css/',
                    src: ['**/*.css', '!*/*.min.css'],
                    dest: 'dist/static_html/css',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/static_html/js/',
                    src: ['**/*.js', '!*/*.min.js'],
                    dest: 'dist/static_html/js'
                }]
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('test', ['newer:tslint', 'clean', 'ts']);
    //let buildTasks = ['tslint', 'clean', 'ts', 'copy', 'cssmin', 'uglify'];
    let buildTasks = ['tslint', 'clean', 'ts', 'copy', 'cssmin'];
    grunt.registerTask('build', buildTasks);
    grunt.registerTask('prod', 'shell:start');
    grunt.registerTask('greenboot', ['clean', 'ts', 'copy', 'cssmin', 'shell:start']);
    grunt.registerTask('default', ['build', 'concurrent:run']);
};
