var EOL = require('os').EOL,
    deferred = require('JQDeferred');

define(function(require) {

  var pass = require('./tip').pass,
      text = require('./tip').text;

  return {

    def: null,

    test: '',
    hosts: [],

    defaultHosts: [
      {
        name: 'Hosts',
        host: '',
        active: false,
        toggle: false,
        readOnly: true
      },
      {
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
      this.hosts = this.get() || this.defaultHosts.slice(0);
      this.refresh();
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

      this.prepare(index);
      this.set();
      this.save();

      return this.def;
    },

    set: function() {
      var arr = [],
          attrs = 'name host using active custom readOnly'.split(' ');

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
      var host = this.hosts[index];

      if (!host) {
        return false;
      }

      host[key] = value;

      this.set();
    },

    del: function(index) {
      this.hosts.splice(index, 1);
      this.set();
    },

    add: function() {
      var template,
          hashArr,
          element,
          $host;

      element = {
        name: 'New One',
        host: '',
        using: false,
        active: false,
        custom: true
      }

      $host = view.add(element);

      this.hosts.push(element);

      this.set();

      //hashArr = {
      //  hostname: element.name
      //};

      //template = render(html, hashArr);

      //$host = $(template);

      //if (element.active) {
      //  $host.addClass('active');
      //}

      //if (element.custom) {
      //  $host.addClass('js-custom');
      //}

      //if (element.using) {
      //  $host.addClass('using');
      //}

      $host.data('hosts', element.host);

      $host.insertBefore('#tpl-list');

      $host.children('a').rename({
        stop: function() {
          this.change(hosts.hosts.length - 1, 'name', this.text());
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
      this.prepare(index);
      this.set();
      this.save()
        .done(function() {
          text.text('Host switched..').drop();
        });
    },

    prepare: function(index) {

      this.text =
        [1, index]
          .map(function(single) {
            var host = this.hosts[single];
            return '# ' + host.name + EOL + host.host;
          }, this)
          .join(EOL);

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
