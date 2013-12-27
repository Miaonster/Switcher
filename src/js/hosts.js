var EOL = require('os').EOL,
    deferred = require('JQDeferred');

define(function(require) {

  var pass = require('./tip').pass,
      text = require('./tip').text;

  return {

    _incrementIndex: 0,

    def: null,

    test: '',
    hosts: [],

    defaultHosts: [
      {
        id: 'all',
        name: 'Hosts',
        host: '',
        active: false,
        toggle: false,
        readOnly: true
      },
      {
        id: 'common',
        name: 'Common',
        host: '',
        active: false,
        toggle: false
      },
      //{
      //  name: 'QA',
      //  host: '',
      //  using: true,
      //  active: true,
      //  custom: true
      //},
      //{
      //  name: 'Dev',
      //  host: '# this is dev host\n 127.0.0.1 www.haha.com\n',
      //  using: false,
      //  active: false,
      //  custom: true
      //},
    ],

    init: function() {
      this.initIncrementIndex();
      this.hosts = this.get() || this.defaultHosts.slice(0);
      this.refresh();
    },

    initIncrementIndex: function() {
      this._incrementIndex = localStorage.getItem('incrementIndex') || 0;
    },

    incrementIndex: function() {
      this._incrementIndex++;
      localStorage.setItem('incrementIndex', this._incrementIndex);
      return this._incrementIndex;
    },

    refresh: function() {
      //view.init(this.hosts);
    },

    show: function(index) {
      view.show(this.hosts[index]);
    },

    store: function(index) {
      var host,
          editor;

      host = this.hosts[index];
      editor = host.editor;

      host.host = editor.getValue();

      this.save();
      this.set();

      return this.def;
    },

    set: function() {
      var arr = [],
          attrs = 'id name host using active custom readOnly'.split(' ');

      this.hosts.forEach(function(host) {
        var tmp = {};

        attrs.forEach(function(attr) {
          tmp[attr] = host[attr];
        });

        arr.push(tmp);
      });

      try {
        localStorage.setItem('hosts', JSON.stringify(arr));
      } catch(e) {
        // Do nothing
      }
    },

    get: function() {
      try {
        return JSON.parse(localStorage.getItem('hosts'));
      } catch(e) {
        return null;
      }
    },

    change: function(index, key, value) {
      this.hosts[index][key] = value;
      this.set();
    },

    del: function(index) {
      this.hosts.splice(index, 1);
      this.save()
        .done(function() {
          text.text('Host saved..').drop();
        });
      this.set();
    },

    add: function() {
      var _this = this,
          template,
          hashArr,
          element,
          $host;

      element = {
        id: this.incrementIndex(),
        name: 'New One',
        host: '',
        using: false,
        active: false,
        custom: true
      }

      view.add(element);

      _this.hosts.push(element);
      _this.set();

      $('.js-custom').last().children('a').rename({
        stop: function() {
          var index = _this.hosts.length - 1;
          _this.change(index, 'name', this.text().trim());
          _this.active(index);
          _this.use(index);
          view.active(index);
          view.use(index - 2);
        }
      });

    },

    onSaveDone: function() {
    },

    onSaveFail: function(code) {
    },

    use: function(index) {
      this.hosts.forEach(function(element) {
        if (element.using) {
          element.using = false;
        }
      });

      this.hosts[index].using = true;
      this.save()
        .done(function() {
          text.text('Host switched..').drop();
        });
      this.set();
    },

    _prepare: function() {
      var i,
          arr = [ 1 ];

      for (i = 0; i < this.hosts.length; i++) {
        if (this.hosts[i].using) {
          arr.push(i);
          break;
        }
      }

      this.text =
          arr
            .map(function(single) {
              var host = this.hosts[single];
              return '# ' + host.name + EOL + host.host;
            }, this)
            .join(EOL + EOL);

      this.hosts[0].host = this.text;
      this.hosts[0].editor.setValue(this.text);
    },

    active: function(index) {
      this.hosts.forEach(function(element) {
        if (element.active) {
          element.active = false;
        }
      });

      this.hosts[index].active = true;
      this.set();
    },

    save: function() {
      var _this = this;

      if (!this.def || this.def.state() !== 'pending') {
        this.def = deferred();
      }

      if (!this.password) {
        this.pass();
        return this.def.promise();
      }

      this._prepare();

      source.save({
        text: this.text,
        password: this.password,
        done: function() {
          _this.onSaveDone();
          _this.def.resolve();
        },
        fail: function() {
          _this.def.reject();
        },
      });

      return this.def.promise();
    },

    pass: function() {
      var _this = this;

      pass.drop(function(value) {
        _this.password = value;
        _this.save();
      });
    }
  };

});
