(function() {
  var coffee, colors, error, exec, fs, inspect, log, path, r, _;

  path = require('path');

  fs = require('fs');

  exec = require('child_process').exec;

  log = console.log, error = console.error;

  inspect = require('util').inspect;

  coffee = require('./node_modules/coffee-script');

  _ = require('./node_modules/underscore');

  colors = require('./node_modules/colors');

  r = {
    exec: function(cmd, options, callback) {
      var _ref;
      if (callback == null) {
        callback = null;
      }
      if (!(callback != null)) {
        _ref = [options, {}], callback = _ref[0], options = _ref[1];
      }
      log("" + 'Executing'.bold.green + " `" + cmd + "`");
      return exec(cmd, options, function(err, stdout, stderr) {
        if (err != null) {
          error(stderr.red);
          process.exit(1);
        }
        if ((stdout != null) && stdout !== '') {
          log(stdout.grey);
        }
        return typeof callback === "function" ? callback(err, stdout, stderr) : void 0;
      });
    },
    compileCoffeescripts: function(directory, options) {
      if (options == null) {
        options = {};
      }
      directory = path.resolve(directory);
      return fs.readdir(directory, function(err, files) {
        return files.forEach(function(file) {
          var filename;
          if (path.extname(file) === '.coffee') {
            filename = "" + directory + "/" + file;
            log("" + 'Read'.bold + " " + filename.italic);
            return fs.readFile(filename, function(err, data) {
              var js;
              if (err != null) {
                console.error(err && process.exit(1));
              }
              log("" + 'Compile'.bold + " " + filename.italic);
              js = coffee.compile(data.toString());
              if (options.shebang) {
                js = "#!/usr/bin/env node\n" + js;
              }
              filename = filename.replace(/\.coffee$/, '.js');
              log("" + 'Write'.bold + " to " + filename.italic);
              return fs.writeFile(filename, js, 'utf8', function(err) {
                if (err != null) {
                  return error(err && process.exit(1));
                }
              });
            });
          }
        });
      });
    },
    generateDoccoHusky: function(directories) {
      var directory;
      directories = (_.flatten([directories])).join(' ');
      directory = path.resolve('./');
      return r.exec('mktemp -d', function(err, stdout, stderr) {
        var tmp;
        if (err != null) {
          error(err);
        }
        tmp = stdout.replace(/^\s*|\s*$/g, '');
        return r.exec("git clone " + directory + " " + tmp, function(err, stdout, stderr) {
          if (err != null) {
            error(err);
          }
          log(stdout);
          return r.exec("git checkout gh-pages", {
            cwd: tmp
          }, function(err, stdout, stderr) {
            if (err != null) {
              error(err);
            }
            log(stdout);
            return r.exec("./node_modules/.bin/docco-husky " + directories, function(err, stdout, stderr) {
              if (err != null) {
                error(err);
              }
              log(stdout);
              return r.exec("cp " + directory + "/docs/* " + tmp + " -r", function(err, stdout, stderr) {
                if (err != null) {
                  error(err);
                }
                log(stdout);
                return r.exec("git add . && git commit -am 'Generated automatically'", {
                  cwd: tmp
                }, function(err, stdout, stderr) {
                  if (err != null) {
                    error(err);
                  }
                  log(stdout);
                  return r.exec("git push origin gh-pages", {
                    cwd: tmp
                  }, function(err, stdout, stderr) {
                    if (err != null) {
                      error(err);
                    }
                    log(stdout);
                    return r.exec("rm -r " + directory + "/docs/");
                  });
                });
              });
            });
          });
        });
      });
    }
  };

  module.exports = r;

}).call(this);
