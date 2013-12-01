var fs = require('fs'),
    hosts = require('./js/hosts.js');

require('./js/rename.js').init(jQuery);

var filepath = '/Users/witcher42/tmp/hosts',
    hosts = null,
    list = null,
    $doc,
    $content;

// 替换模版
function render(template, textHashArr) {
  var i, result = '', textHash;

  function replaceFunc($0, $1) {
    return textHash[$1] || '';
  }

  if (!Array.isArray(textHashArr)) {
    textHashArr = [ textHashArr ];
  }
  for (i=0; i<textHashArr.length; i++) {
    textHash = textHashArr[i];
    result += template.replace(/{{(.*?)}}/g, replaceFunc);
  }
  return result;
};

$doc = $(document);

var $item,
    hosts,
    view,
    source;

source = require('./js/source');

view = {

  nav: $('#js-tpl-list').html(),
  content: $('#js-tpl-content').html(),

  init: function(hosts) {
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

    $item = $(render(html, hashArr));

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

hosts = {

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
    view.init(this.hosts);
  },

  show: function(index) {
    view.show(this.hosts[index]);
  },

  set: function() {
    try {
      localStorage.setItem('hosts', JSON.stringify(this.hosts));
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

    this.hosts.push(element);

    this.set();

    hashArr = {
      hostname: element.name
    };

    template = render(html, hashArr);

    $host = $(template);

    if (element.active) {
      $host.addClass('active');
    }

    if (element.custom) {
      $host.addClass('js-custom');
    }

    if (element.using) {
      $host.addClass('using');
    }

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

  save: function() {
    if (!this.password) {
      return this.showModal();
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

$doc.on('mousedown', '#js-list a', function(e) {
  //e.preventDefault();
  //$(this).tab('show');
  /*var index = $(this).parent().prevAll('li:not(#js-list-hosts)').length;
  $(this).tab('show');
  hosts.show(index);*/
});

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

$content = $('#js-content');
$content.val(source.read());
