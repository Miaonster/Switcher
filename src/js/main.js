var fs = require('fs'),
    gui = require('nw.gui'),
    win = gui.Window.get(),
    template,
    hosts,
    view,
    source,
    setting;

define(function(require) {

  var shortcut,
      $doc = $(document);

  function initDom() {

    $doc.on('dblclick', '.js-custom a', function(e) {
      var index = $(this).parent().prevAll('li').length;
      view.active(index);
      view.use(index - 2);
      hosts.active(index);
      hosts.use(index);
      e.preventDefault();
    });

    $doc.on('click', '.js-add', function(e) {
      hosts.add();
    });

    $doc.on('click', '.js-del', function(e) {
      var $item = $('.active'),
          index = $item.prevAll('li:not(#js-list-hosts)').length;

      if (index < 2) { return false; }

      $item.prev().addClass('active');
      $item.remove();
      hosts.del(index);
      hosts.active(index - 1);
      view.active(index - 1);
    });

    $doc.on('shown.bs.tab', '[data-toggle=tab]', function (e) {
      var id = $(this).attr('href');
      $(id).find('.CodeMirror').get(0).CodeMirror.refresh();
    });

  }

  function initModules() {
    var rename;

    template = require('./template'),
    hosts = require('./host'),
    view = require('./view'),
    source = require('./source');
    setting = require('./setting');
    rename = require('./rename');

    rename.init(jQuery);

    hosts.init();
    view.init(hosts.hosts);
    setting.init();
  }

  initDom();
  initModules();

  win.show();
  win.focus();
});
