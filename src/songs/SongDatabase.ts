import * as parser from 'fast-xml-parser';
import { Song } from './types/Song';
import * as fs from 'fs';
import { SearchResult, SearchOptions } from './types/Search';

export default class SongDatabase {
  private songs: Song[] = [];

  constructor() {
    const base64Database = fs.readFileSync('data/songs.db', 'utf8');
    const xml = Buffer.from(base64Database, 'base64').toString('utf8');
    const jsonObj = parser.parse(xml, {}, true);

    jsonObj.songs.song.forEach((song, index) => {
      this.songs.push({
        id: index,
        title: song.title,
        text: song.text,
        normalizedText: this.normalizeText(song.text),
        hasChords: song.text.includes('{') && song.text.includes('}'),
      });
    });
  }

  getTextSnipped = (input: string): string => {
    let response = '';
    const sentences = input.split('. ');
    let maxSentences = 2;
    for (const sentence of sentences) {
      response += `${sentence}. `;
      maxSentences -= maxSentences - 1;
      if (maxSentences === 0) {
        break;
      }
    }

    return response;
  };

  normalizeText = (input: string): string => {
    return input
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/\{\w*\}/gi, '')
      .replace(/<\/?\w*>/gi, '')
      .replace(/\[\w*\]/gi, '');
  };

  findSongByString = (
    searchString: string,
    opts?: SearchOptions,
  ): SearchResult[] => {
    const lowercaseSearchString = searchString.toLocaleLowerCase();
    const results = [];
    for (const song of this.songs) {
      if (opts.chordsOnly && !song.hasChords) {
        continue;
      }
      if (
        (opts.includeTitle &&
          song.title.toLocaleLowerCase().indexOf(lowercaseSearchString) >= 0) ||
        (opts.includeText &&
          song.normalizedText
            .toLocaleLowerCase()
            .indexOf(lowercaseSearchString) >= 0)
      ) {
        const searchResult: SearchResult = song;

        if (opts?.addTextSnipped) {
          searchResult.textSnipped = this.getTextSnipped(song.normalizedText);
        }

        if (opts?.includeText) {
          const phrasePosition = song.normalizedText
            .toLocaleLowerCase()
            .indexOf(searchString);
          searchResult.phrase = song.normalizedText
            .substring(phrasePosition - 10, phrasePosition + 20)
            .trim();
        }
        results.push(searchResult);
      }
    }
    results.sort(this.alphabeticTitleComparator);

    return results;
  };

  alphabeticTitleComparator = (a: Song, b: Song): number => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  };

  getSize(): number {
    return this.songs.length;
  }

  getSongById(id: number): Song {
    return this.songs.find((song) => song.id === id);
  }
}
