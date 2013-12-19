define(function(require) {

  return {

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

    active: function(index) {
      this.activeHosts = this.hosts[0].host + this.hosts[index].host;
      this.save();
    },

    save: function(identify) {
      if (!this.password) {
        //return this.showModal();
      }
      source.save({
        text: this.activeHosts,
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
