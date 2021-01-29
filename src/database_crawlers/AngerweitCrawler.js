var request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');
var sleep = require('sleep');

var failed = [];

const HOST = 'http://angerweit.tikon.ch/lieder/';

/*
request('http://angerweit.tikon.ch/lieder/?menu=0-1-1&lang=de', function (error, response, body) {
    const $ = cheerio.load(body);
    const dl = $('dl');
    dl.find('dd').each(function () {
        let url = $(this).find('a').attr('href');
        sleep.msleep(100);
        requestSong(url);
    });
});
*/

requestSong('lied.php?src=folk-skan/midsommar');

function requestSong(url) {
    request(HOST + url, function (error, response, body) {
        const $ = cheerio.load(body);
        const title = $('h1').text();
        console.log(title);
    });
}
