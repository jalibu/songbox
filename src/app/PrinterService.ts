import * as Printer from 'thermalprinter';
import * as SerialPort from 'serialport';
import {promisify} from 'util';
import {SongtextFormatter} from './SongtextFormatter';

const config = require('../config');

export class PrinterService {
    private formatter: SongtextFormatter = new SongtextFormatter();
    private printerConfig: any = config.printer || {};
    private printerPort: string = this.printerConfig.port || '/dev/ttyS0';
    private printerBaudRate: number = this.printerConfig.baudRate || 19200;
    private legacyPrint: boolean = this.printerConfig.legacyPrint || false;
    private tempFile: string = this.printerConfig.tempFile || '/tmp/printFile.png';
    private printer: any;
    private isBusy: boolean;

    public printSong = async (song: any): Promise<string> => {
        if (this.isBusy) {
            return Promise.reject('Drucker ist belegt. Probiere es später wieder.');
        }
        try {
            this.isBusy = true;
            if (!this.legacyPrint) {
                await this.formatter.generateSongtext(song);
            }
            if (this.printer) {
                this.printer.indent(0);
                if (this.legacyPrint) {
                    this.printer.bold(true).printLine(song.title).horizontalLine(16).bold(false).small(true);
                    let lines = song.text.split('<br>');
                    for (let line of lines) {
                        this.printer.printLine(line);
                    }
                } else {
                    this.printer.printImage(this.tempFile);
                }
                this.printer.lineFeed(3);
                this.printer.print(() => {
                    this.isBusy = false;
                });
            } else {
                this.debugPrint(song);
                this.isBusy = false;
            }

            return Promise.resolve('ok');
        } catch (err) {
            this.isBusy = false;
            return Promise.reject(err);
        }
    }

    public constructor() {
        this.isBusy = false;
        if (!config.printer.debug) {
            let connection = new SerialPort(this.printerPort, {
                baudRate: this.printerBaudRate
            });
            connection.on('open', () => {
                this.printer = new Printer(connection);
                this.printer.print = promisify(this.printer.print);
            });
            connection.on('error', (err) => {
                console.log('Could not open connection to the printer: ' + err);
            });
        }
    }

    private debugPrint(song: any): void {
        console.log(song.title);
        let lines = song.text.split('<br>');
        for (let line of lines) {
            console.log(line);
        }
    }
}