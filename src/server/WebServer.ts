import * as express from 'express';
import * as path from 'path';
import {PrinterService} from '../app/PrinterService';
import {SongsLibrary} from '../app/SongsLibrary';

const config = require('../config');

export class WebServer {
    private PORT: number = config.webPort || 8080;
    private songsLib: SongsLibrary = new SongsLibrary();
    private printerService: PrinterService = new PrinterService();

    public startServer(): void {

        const app = express();

        app.use('/', express.static(path.join(__dirname + '/../static_html')));

        app.get('/song/:songId', async (req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(this.songsLib.getSongById(req.params.songId)));

        });

        app.get('/print/:songId', async (req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            let response;
            try {
                let song = this.songsLib.getSongById(req.params.songId);
                await this.printerService.printSong(song);
                res.send(JSON.stringify({'status': 'OK'}));
            } catch (err) {
                res.send(JSON.stringify({'status': 'failed', 'error': err}));
            }
        });

        app.get('/search/:term', async (req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            let opts = {
                includeTitle: true,
                includeText: true,
                chordsOnly: false,
                addTextSnipped: true
            };
            res.send(JSON.stringify(this.songsLib.findSongByString(req.params.term, opts)));

        });

        app.get('/fullSearch/:term', async (req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            let opts = {
                includeTitle: req.query.includeTitle === 'true',
                includeText: req.query.includeText === 'true',
                chordsOnly: req.query.chordsOnly === 'true',
                addTextSnipped: true
            };
            res.send(JSON.stringify(this.songsLib.findSongByString(req.params.term, opts)));
        });

        app.get('/getTotalSongsNumber', async (req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({'songs': this.songsLib.getTotalSongNumber()}));

        });

        app.listen(this.PORT, () => {
            console.log('Rest Endpoint Server started listening on port ' + this.PORT);
        });
    }
}
