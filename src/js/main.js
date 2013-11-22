var fs = require('fs'),
    hosts = require('./js/hosts.js');

require('./js/rename.js').init(jQuery);

var filepath = '/Users/witcher42/tmp/hosts',
    options = { encoding: 'utf8' },
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

$content = $('#js-content');
$content.text(fs.readFileSync(filepath, options));

var $item,
    hosts,
    html = $('#tpl-list').html();

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
      host: '',
      using: false,
      active: false,
      custom: true
    },
  ],

  init: function() {
    this.hosts = this.get() || this.defaultHosts.slice(0);
    this.show();
  },

  show: function() {

    this.hosts.forEach(function(element, index) {

      var template,
          hashArr,
          $host;

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

    });

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

  }

};

$doc.on('click', '#js-list a', function(e) {
  e.preventDefault();
  $(this).tab('show');
});

$doc.on('dblclick', '.js-custom a', function(e) {
  e.preventDefault();
  $('.using').removeClass('using');
  $(this).parent().addClass('using');
});

$doc.on('click', '.js-add', function(e) {
  hosts.add();
});

$doc.on('click', '.js-del', function(e) {
  hosts.del($('.active').prevAll('li:not(#js-list-hosts)').length);
});

hosts.init();
