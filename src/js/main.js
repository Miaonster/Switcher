var fs = require('fs'),
    template,
    hosts,
    view,
    source;

define(function(require) {

  var shortcut,
      $doc = $(document);

  function init() {

    $doc.on('dblclick', '.js-custom a', function(e) {
      var index = $(this).parent().prevAll('li').length - 1;
      view.active(index - 1);
      hosts.active(index);
      e.preventDefault();
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
    view.init(hosts.hosts);

    //$('#js-content').val(source.read());
  }

  template = require('./template'),
  hosts = require('./hosts'),
  view = require('./view'),
  source = require('./source');

  require('./rename').init(jQuery);

  init();

});
