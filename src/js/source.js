var fs = require('fs'),
    exec = require('child_process').exec,
    sprintf = require('sprintf').sprintf;

module.exports = {

  path: '/Users/witcher42/tmp/hosts',
  options: { encoding: 'utf8' },

  done: null,
  fail: null,
  password: null,

  read: function() {
    return fs.readFileSync(this.path, this.options);
  },

  save: function(options) {
    this.done = options.done;
    this.fail = options.fail;
    this.text = options.text;
    this.password = options.password;

    this.chmod('777');
  },

  saveFile: function() {
    try {
      fs.writeFileSync(this.path, this.text, this.options);
    } catch(e) {
      this.fail(e.code);
      return false;
    }

    this.chmod('644');
  },

  chmod: function(stat) {
    var command = sprintf('echo %s | sudo -S chmod %s %s', this.password, stat, this.path);

    function callback(error, stdout, stderr) {
      if (error !== null) {
        this.fail(error);
      } else {
        this.saveFile();
        this.done();
      }
    }

    exec(command, callback.bind(this));
  }

};
