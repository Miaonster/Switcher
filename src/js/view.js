var $,
    hosts,
    view;

view = {

  nav: '',
  content: '',

  init: function(hosts) {

    this.nav = $('#js-tpl-list').html();
    this.content = $('#js-tpl-content').html();

    hosts.forEach(function(element, index) {
      view.add(element);
    });

  },

  add: function(element) {
    this._addNav(element);
    this._addContent(element);
  },

  show: function(host) {
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

    $item = $(render(html, hashArr));
    $content = $item.find('textarea');
    $content.val(element.host);
    $item.insertBefore('#js-tpl-content');

    CodeMirror.fromTextArea($content.get(0), { mode: 'hosts' } );
  },

  mousetrap: function() {
    Mousetrap.bind('command+s', function() {
      $('.switcher-content.active textarea');
    });
  }

};

exports.init = function() {
  view.init();
};
