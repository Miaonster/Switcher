var fs = require('fs'),
    template = require('./js/template'),
    hosts = require('./js/hosts'),
    view = require('./js/view'),
    source = require('./js/source');

require('./js/rename').init(jQuery);

var filepath = '/Users/witcher42/tmp/hosts',
    $doc,
    $content,
    $item,
    list = null,
    view,
    shortcut;

function init() {
  $doc = $(document);

  $doc.on('dblclick', '.js-custom a', function(e) {
    var $this = $(this),
        $using = $('.using'),
        index;

    e.preventDefault();
    $using.removeClass('using');
    $this.parent().addClass('using');

    index = $this.parent().prevAll('li').length - 1;
    hosts.active(index);
  });

  $doc.on('click', '.js-add', function(e) {
    hosts.add();
  });

  $doc.on('click', '.js-del', function(e) {
    var $item = $('.active'),
        index = $item.prevAll('li:not(#js-list-hosts)').length;
    $item.prev().addClass('active');
    $item.remove();
    hosts.del(index);
    hosts.active(index - 1);
  });

  hosts.init();
  view.init();

  $content = $('#js-content');
  $content.val(source.read());
}

shortcut = {
  init: function() {
    $('.tab-content .switcher-content').on('keydown', function(e) {
      if (e.keyCode === 83 && e.ctrlKey) {
        hosts.save();
      }
    });
  }
};

init();
shortcut.init();
