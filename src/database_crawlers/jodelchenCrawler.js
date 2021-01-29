var request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');

var text = fs.readFileSync('Taschenjodelchen.html', 'utf8');

const $ = cheerio.load(text);

$('body').find('p').each(function () {
    fs.appendFile("/tmp/jodelchen.txt", $(this).text() + '\n', function () {
    });
    console.log($(this).text());
});

console.log();
