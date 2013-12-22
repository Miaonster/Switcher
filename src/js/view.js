define(function(require) {

  var view,
      pass = require('./tip').pass,
      text = require('./tip').text;

  view = {

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

    use: function(index) {
      $('.using').removeClass('using');
      $('.js-custom').eq(index).addClass('using');
    },

    active: function(index) {
      $('#js-list > li').eq(index).find('a').tab('show');
    },

    choose: function() {
      $('.js-custom.active a').tab('show');
    },

    _addNav: function(element) {
      var hashArr,
          html,
          $item;

      hashArr = {
        id: element.id,
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
          readOnly,
          options,
          $item,
          $content;

      html = this.content;

      hashArr = {
        id: element.id
      };

      $item = $(template(html, hashArr));

      $content = $item.find('textarea');
      $content.val(element.host);
      $item.insertBefore('#js-tpl-content');

      readOnly = element.readOnly ? 'nocursor' : false;

      options = {
        mode: 'hosts',
        readOnly: readOnly,
      };

      element.editor = CodeMirror.fromTextArea($content.get(0),  options);
      if (!readOnly) {
        element.editor.on('change', this._onchange);
      }

      if (!element.active) {
        $item.removeClass('active');
      }
    },

    _onchange: function(mirror) {
      $('.js-custom.active').find('.change').show();
    },

    _onsave: function() {
      text.text('Host saved..').drop();
      $('.js-custom.active').find('.change').hide();
    },

    mousetrap: function() {
      Mousetrap.bindGlobal('command+s', function() {
        var index = $('.switcher-content.active').prevAll('.switcher-content').length;

        if (index === 0) {
          return;
        }

        hosts
          .store(index)
            .done(function() {
              view._onsave();
            });
      });
    }

  };

  return view;

});
