var path = require('path');
module.exports = function (grunt) {
  var site = grunt.file.readJSON('site.json');
  grunt.initConfig({
    bower: {
      install: {
        options: {
          targetDir: 'src',
          layout: function (type, component) {
            var renamedType = type;
            if (type == 'js') {
              renamedType = 'scripts';
            } else if (type == 'css') {
              renamedType = 'styles';
            }
            return path.join(renamedType, component);
          },
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false
        }
      }
    },
    pages: {
      posts: {
        src: 'posts',
        dest: 'dist',
        layout: 'src/layouts/post.ejs',
        url: function (post, options) {
          return options.formatPostUrl(post.sourcePath.replace('.md', '/'));
        },
        options: {
          pageSrc: 'src/pages',
          data: site,
          formatPostUrl: function (url) {
            return url
              .toLowerCase() // change everything to lowercase
              .replace(/^\s+|\s+$/g, '') // trim leading and trailing spaces
              .replace(/[_|\s|\.]+/g, '-') // change all spaces, periods and underscores to a hyphen
              .replace(/[^a-z\u0400-\u04FF0-9-]+/g, '') // remove all non-cyrillic, non-numeric characters except the hyphen
              .replace(/[-]+/g, '-') // replace multiple instances of the hyphen with a single instance
              .replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
          },
          pagination: [
            {
              postsPerPage: 20,
              listPage: 'src/pages/archives.ejs',
              url: 'archives/:id/index.html'
            },
            {
              url: 'tags/:id/index.html',
              listPage: 'src/pages/tag.ejs',
              getPostGroups: function (posts) {
                var postGroups = {};

                posts.forEach(function (post) {
                  post.tags.forEach(function (tag) {
                    tag = tag.toLowerCase();
                    if (postGroups[tag]) {
                      postGroups[tag].posts.push(post);
                    } else {
                      postGroups[tag] = {
                        posts: [post]
                      };
                    }
                  });
                });

                return grunt.util._.map(postGroups, function (postGroup, id) {
                  return {
                    id: id,
                    posts: postGroup.posts
                  };
                });
              }
            }
          ],
          rss: {
            author: site.author,
            title: site.title,
            description: site.description,
            url: site.url,
            numPosts: 5
          }
        }
      }
    },
    compass: {
      clean: {
        options: {
          clean: true
        }
      },
      prod: {
        options: {
          sassDir: 'src/styles',
          cssDir: 'dist/styles',
          outputStyle: 'compressed'
        }
      },
      dev: {
        options: {
          sassDir: 'src/styles',
          cssDir: 'dist/styles'
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src',
            dest: 'dist',
            src: [
              'images/**',
              'scripts/**',
              'styles/**.css',
              'styles/fonts/**'
            ]
          }
        ]
      }
    },
    watch: {
      pages: {
        files: [
          'posts/**',
          'src/layouts/**',
          'src/pages/**'
        ],
        tasks: ['pages']
      },
      compass: {
        files: ['src/styles/**'],
        tasks: ['compass:dev']
      },
      copy: {
        files: [
          'src/images/**',
          'src/scripts/**',
          'src/styles/**.css',
          'src/styles/fonts/**'
        ],
        tasks: ['copy']
      },
      dist: {
        files: ['dist/**'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      dist: {
        options: {
          port: 5455,
          hostname: '0.0.0.0',
          base: 'dist',
          livereload: true
        }
      }
    },
    open: {
      dist: {
        path: 'http://localhost:5455'
      }
    },
    clean: {
      dist: 'dist',
      options: {
        force: true
      }
    },
    'gh-pages': {
      options: {
        base: 'dist',
        branch: 'master',
        repo: 'git@github.com:ayapi/ayapi.github.io.git',
        message: 'Auto-generated commit by grunt-gh-pages'
      },
      src: ['**']
    },
    gitpush: {
      src: {
        options: {
          branch: 'master'
        }
      }
    }
  });

  grunt.registerTask('build', 'A task that builds cabin site', function(arg){
    if (arguments.length === 0) {
      grunt.log.writeln(this.name + " task cannot run without argument 'dev' or 'prod'.");
      return false;
    }
    var tasks = [
      'clean',
      'pages',
      'compass:clean',
      'compass:' + arg,
      'copy'
    ];
    grunt.task.run(tasks);
    return true;
  });

  grunt.registerTask('deploy', ['gitpush:src', 'build:prod', 'gh-pages']);

  grunt.registerTask('server', [
    'build:dev',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('default', 'server');

  require('load-grunt-tasks')(grunt);
};
