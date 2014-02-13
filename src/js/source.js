var fs = require('fs'),
    exec = require('child_process').exec,
    sprintf = require('sprintf').sprintf,
    deferred = require('JQDeferred');

define(function() {

  return {

    path: platform === 'win' ? "C:\\Windows\\System32\\drivers\\etc\\hosts" : '/etc/hosts',

    options: { encoding: 'utf8' },

    done: null,
    fail: null,
    password: null,

    read: function() {
      return fs.readFileSync(this.path, this.options);
    },

    save: function(options) {
      var _this = this;

      this.done = options.done;
      this.fail = options.fail;
      this.text = options.text;
      this.password = options.password;

      if (platform === 'win') {
        this._saveWin();
      } else {
        this._chmod('777')
          .done(function() {
              _this._save();
          })
          .fail(function() {
              _this.fail();
          });
      }
    },

    _save: function() {
      try {
        fs.writeFileSync(this.path, this.text, this.options);
      } catch(e) {
        this.fail(e.code);
        return false;
      }

      this.done();
      this._chmod('644');
    },

    _saveMac: function() {
    },

    _saveWin: function() {
      try {
        fs.writeFileSync(this.path, this.text, this.options);
      } catch(e) {
        this.fail(e.code);
        return false;
      }

      this.done();
    },

    _chmod: function(stat) {
      var def = deferred(),
          command = sprintf('echo %s | sudo -S chmod %s %s', this.password, stat, this.path);

      function callback(error, stdout, stderr) {
        if (error !== null) {
          def.reject();
        } else {
          def.resolve();
        }
      }

      exec(command, callback.bind(this));

      return def.promise();
    }

  };

});
