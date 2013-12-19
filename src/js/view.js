define(function(require) {

  var view = {

    nav: '',
    content: '',

    init: function(hosts) {
      this.nav = $('#js-tpl-list').html();
      this.content = $('#js-tpl-content').html();

      hosts.forEach(function(element, index) {
        view.add(element);
      });

      this.choose();
      this.mousetrap();
    },

    /*
    initEvent: function() {
      $('.tab-content .switcher-content').on('keydown', function(e) {
        if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {

        }
      });
    },
    */

    add: function(element) {
      this._addNav(element);
      this._addContent(element);
    },

    show: function(host) {
    },

    active: function(index) {
      $('.using').removeClass('using');
      $('.js-custom').eq(index).addClass('using');
    },

    choose: function() {
      $('.js-custom.active a').tab('show');
    },

    _addNav: function(element) {
      var hashArr,
          html,
          $item;

      hashArr = {
        hostname: element.name,
        contentname: element.name.toLowerCase()
      };

      html = this.nav;

      $item = $(template(html, hashArr));

      if (element.active) {
        $item.addClass('active');
      }

      if (element.custom) {
        $item.addClass('js-custom');
      }

      if (element.using) {
        $item.addClass('using');
      }

      $item.data('hosts', element.host);

      $item.insertBefore('#js-tpl-list');
    },

    _addContent: function(element) {
      var hashArr,
          html,
          $item,
          $content;

      html = this.content;

      hashArr = {
        hostname: element.name.toLowerCase()
      };

      $item = $(template(html, hashArr));

      $content = $item.find('textarea');
      $content.val(element.host);
      $item.insertBefore('#js-tpl-content');

      element.editor = CodeMirror.fromTextArea($content.get(0), { mode: 'hosts' } );

      if (!element.active) {
        $item.removeClass('active');
      }

    },

    mousetrap: function() {
      Mousetrap.bindGlobal('command+s', function() {
        var index = $('.switcher-content.active').prevAll('.switcher-content').length - 1;
        hosts.store(index);
      });
    }

  };

  return view;

});
