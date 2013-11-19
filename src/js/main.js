var fs = require('fs');

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

hosts = [
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
];

try {
  hosts = JSON.parse(localStorage.getItem('hosts')) || hosts;
} catch(e) {

}

var $item,
    html = $('#tpl-list').html();

hosts.forEach(function(element, index) {

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

$doc.on('click', '#js-list a', function(e) {
  e.preventDefault();
  $(this).tab('show');
});

$doc.on('dblclick', '.js-custom a', function(e) {
  e.preventDefault();
  $('.using').removeClass('using');
  $(this).parent().addClass('using');
});
