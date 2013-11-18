var fs = require('fs');

var filepath = '/Users/witcher42/tmp/hosts',
    options = { encoding: 'utf8' },
    hosts = null,
    list = null,
    $content;

hosts = fs.readFileSync(filepath, options);

$('#js-list-hosts').on('click', function(e) {
});

$content = $('#js-content');

$content.text(hosts);

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
    active: true,
    toggle: true
  },
  {
    name: 'Dev',
    host: '',
    active: false,
    toggle: true
  },
];

try {
  hosts = JSON.parse(localStorage.getItem('hosts')) || hosts;
} catch(e) {

}

var $item,
    $template;

hosts.forEach(function(element, index) {

  $template = $($('#tpl-list').html());

  if (element.active) {
    $template.addClass('active');
  }

  if (element.toggle) {
    $template.attr('data-toggle', 'tab');
  }

  $template.find('a')
      .data('hosts', element.host)
      .text(element.name);

  $template.insertBefore('#tpl-list');

});
