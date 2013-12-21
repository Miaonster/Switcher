var EOL = require('os').EOL;

define(function(require) {

  return {

    test: '',
    hosts: [],

    defaultHosts: [
      {
        name: 'Common',
        host: '',
        active: false,
        toggle: false
      },
      {
        name: 'QA',
        host: '',
        using: true,
        active: true,
        custom: true
      },
      {
        name: 'Dev',
        host: '# this is dev host\n 127.0.0.1 www.haha.com\n',
        using: false,
        active: false,
        custom: true
      },
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
      this.set();
      this.prepare(index);
      this.save();
    },

    set: function() {
      var arr = [],
          attrs = 'name host using active custom'.split(' ');

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
      this.save();
    },

    prepare: function(index) {
      this.text =
        this.hosts[0].host +
        EOL + EOL +
        this.hosts[index].host +
        EOL + EOL;
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
      if (!this.password) {
        //return this.showModal();
      }
      source.save({
        text: this.text,
        password: this.password,
        done: this.onSaveDone,
        fail: this.onSaveFail,
      });
    },

    showModal: function() {
      var _this = this,
          $modal = $('#password-modal');

      $modal.modal('show');
      $modal.find('.js-save').one('click', function() {
        $modal.modal('hide');
        _this.password = $modal.find('.js-password').val();
        _this.save();
      });
    }
  };

});
