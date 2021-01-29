var request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');
var sleep = require('sleep');

var failed = ['https://www.lieder-archiv.de/schneidri_schneidra_schneidrum-notenblatt_400108.html',
    'https://www.lieder-archiv.de/nun_danket_alle_gott-notenblatt_300778.html',
    'https://www.lieder-archiv.de/mein_gaertchen-notenblatt_100414.html',
    'https://www.lieder-archiv.de/du_liebst_einen_schoenern_schatz-notenblatt_500561.html',
    'https://www.lieder-archiv.de/vertrauen-notenblatt_500880.html',
    'https://www.lieder-archiv.de/hafer_maehn-notenblatt_402007.html',
    'https://www.lieder-archiv.de/danziger_fischerlied-notenblatt_400516.html',
    'https://www.lieder-archiv.de/alles_was_wir_lieben_lebe-notenblatt_600704.html',
    'https://www.lieder-archiv.de/die_lore_am_tore-notenblatt_502140.html',
    'https://www.lieder-archiv.de/ich_kam_vor_einer_frau_wirtin_haus-notenblatt_300427.html',
    'https://www.lieder-archiv.de/fein_sein_beinand_bleibn-notenblatt_600031.html',
    'https://www.lieder-archiv.de/spinn_spinn_meine_liebe_tochter-notenblatt_300657.html',
    'https://www.lieder-archiv.de/nachtgebet-notenblatt_100178.html',
    'https://www.lieder-archiv.de/mord_an_der_geliebten-notenblatt_500441.html',
    'https://www.lieder-archiv.de/liebe_macht_die_menschen_dumm-notenblatt_501010.html',
    'https://www.lieder-archiv.de/das_almosen-notenblatt_500720.html',
    'https://www.lieder-archiv.de/fuchs_du_hast_die_gans_gestohlen-notenblatt_300721.html',
    'https://www.lieder-archiv.de/flamme_empor-notenblatt_300499.html',
    'https://www.lieder-archiv.de/mein_vater_ist_bergmann-notenblatt_300529.html',
    'https://www.lieder-archiv.de/liebchen_ade-notenblatt_400096.html',
    'https://www.lieder-archiv.de/rheinweinlied-notenblatt_600518.html',
    'https://www.lieder-archiv.de/nimm_mich_gruenes_waldeszelt-notenblatt_600622.html'];
//for (var i = 97; i <= 122; i++) {
for (var i = 0; i <= failed.length - 1; i++) {
    //sleep.msleep(1000);
    //console.log(String.fromCharCode(i));
    //request('https://www.lieder-archiv.de/lieder_sammlung_' + String.fromCharCode(i) + '.html', function (error, response, body) {
    //    const $ = cheerio.load(body);
    //    $('ul.list > li').each(function () {
    //for (i = 0; i < failed.length; i++) {
    let currentUrl = failed[i];
    //let currentUrl = $(this).find('a').attr('href');
    console.log(currentUrl);
    sleep.msleep(100);
    request(currentUrl, function (error, response, body) {
        sleep.msleep(100);
        try {
            const $ = cheerio.load(body);
            let title = $('h2').text();

            if (title && title.length > 0) {
                let text = '<song>';
                text += '<title>' + $('h2').text() + '</title>';
                text += '<category>Volkslieder</category>';
                text += '<text><![CDATA[';

                let first = true;
                $('#liedtext > .lyrics-container > p').each(function () {
                    text += first ? '' : '\n\n';
                    first = false;
                    text += $(this).html().replace(/<br\s*\/?>/gi, '\n').replace(/&#xFC;/gi, 'ü').replace(/&#xE4;/gi, 'ä').replace(/&#xF6;/gi, 'ö').replace(/&#xDF;/gi, 'ß').replace(/&#xC4;/gi, 'Ä').replace(/&#x2013;/gi, '-').replace(/&#xD6;/gi, 'Ö').replace(/&quot;/gi, '\'').replace(/&#xAB;/gi, '\'').replace(/&apos;/gi, '\'');
                });
                text += ']]></text>';
                text += '</song>';
                fs.appendFile("/tmp/songs.txt", text, function () {
                    //console.log($('h2').text() + ' saved');
                });
            } else {
                fs.appendFile("/tmp/failedUrls.txt", '\'' + currentUrl + '\',\n', function () {
                });
            }
        } catch (er) {
            console.log(currentUrl);
        }

    });
    //}

    //    });
    // });
}