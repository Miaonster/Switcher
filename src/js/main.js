var fs = require('fs');

var filepath = '/Users/witcher42/tmp/hosts',
    options = { encoding: 'utf8' },
    hosts = '',
    $content;

hosts = fs.readFileSync(filepath, options);

$('#js-list-hosts').on('click', function(e) {
});

$content = $('#js-content');

$content.text(hosts);
