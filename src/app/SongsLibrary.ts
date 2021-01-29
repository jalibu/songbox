import {Song} from '../models/Song';
import {SearchResult} from '../models/SearchResult';

const parseString = require('xml2js').parseString;
const fs = require('fs');

export class SongsLibrary {
    private songLib: Song[];

    public constructor() {
        this.songLib = this.parseSongsLib();
    }

    private parseSongsLib(): Song[] {
        let xml = fs.readFileSync('dist/data/songs.xml', 'utf8');
        let error = null;
        let json = null;
        let options = {
            explicitArray: false,
            explicitRoot: false,
            trim: true
        };
        parseString(xml, options, (innerError, innerJson) => {
            error = innerError;
            json = innerJson;
        });

        if (error) {
            throw error;
        }

        let result: Song[] = [];
        for (let song of json.song) {
            result.push(new Song(song));
        }

        return result;
    }

    public getSongById(songId: number): any {
        return this.songLib[songId];
    }

    public getTotalSongNumber(): number {
        return this.songLib.length;
    }

    public findSongByString(searchString: string, opts: any): SearchResult[] {
        opts = opts || {};
        searchString = searchString.toLocaleLowerCase();
        let result = [];
        for (let song of this.songLib) {
            if (song.hasChords || !opts.chordsOnly) {
                if (opts.includeTitle && song.title.toLocaleLowerCase().indexOf(searchString) >= 0) {
                    let searchResult = new SearchResult(this.songLib.indexOf(song), song.title, song.category);
                    searchResult.hasChords = song.text.indexOf('<span>') >= 0;
                    if (opts.addTextSnipped) {
                        let normalizedText = this.normalizeText(song.text);
                        searchResult.textSnipped = this.getTextSnipped(normalizedText);
                    }
                    result.push(searchResult);
                } else if (opts.includeText && song.text.toLocaleLowerCase().indexOf(searchString) >= 0) {
                    let searchResult = new SearchResult(this.songLib.indexOf(song), song.title, song.category);
                    searchResult.hasChords = song.text.indexOf('<span>') >= 0;
                    let normalizedText = this.normalizeText(song.text);
                    let phrasePosition = normalizedText.toLocaleLowerCase().indexOf(searchString);
                    searchResult.phrase = normalizedText.substring(phrasePosition - 10, phrasePosition + 20).trim();
                    if (opts.addTextSnipped) {
                        searchResult.textSnipped = this.getTextSnipped(normalizedText);
                    }

                    result.push(searchResult);
                }
            }
        }
        result.sort(this.alphabeticTitleComparator);
        return result;
    }

    private alphabeticTitleComparator(a: Song, b: Song): number {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    }

    private getTextSnipped(input: string): string {
        let response = '';
        let sentences = input.split('. ');
        let maxSentences = 2;
        for (let sentence of sentences) {
            response += sentence + '. ';
            maxSentences--;
            if (maxSentences === 0) {
                break;
            }
        }
        return response;
    }

    private normalizeText(input: string): string {
        return input.replace(/<br\s*\/?>/gi, ' ')
            .replace(/\{\w*\}/gi, '')
            .replace(/<\/?\w*>/gi, '')
            .replace(/\[\w*\]/gi, '');
    }
}