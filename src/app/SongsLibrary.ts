import * as fs from "fs";
import { Parser } from "xml2js";
import Song from "../models/Song";
import SearchResult from "../models/SearchResult";

const parser = new Parser();
export default class SongsLibrary {
  private songLib: Song[];

  public constructor() {
    this.songLib = this.parseSongsLib();
  }

  parseSongsLib = (): Song[] => {
    const xml = fs.readFileSync("dist/data/songs.xml", "utf8");
    let json = null;
    const options = {
      explicitArray: false,
      explicitRoot: false,
      trim: true,
    };
    parser.parseString(xml, options, (innerError, innerJson) => {
      json = innerJson;
    });

    const result: Song[] = [];
    json.song.forEach((song) => {
      result.push(new Song(song));
    });

    return result;
  };

  public getSongById(songId: number): any {
    return this.songLib[songId];
  }

  public getTotalSongNumber(): number {
    return this.songLib.length;
  }

  findSongByString = (searchString: string, opts: any): SearchResult[] => {
    const searchString2 = searchString.toLocaleLowerCase();
    const result = [];
    this.songLib.forEach((song) => {
      if (song.hasChords || !opts.chordsOnly) {
        if (
          opts.includeTitle &&
          song.title.toLocaleLowerCase().indexOf(searchString2) >= 0
        ) {
          const searchResult = new SearchResult(
            this.songLib.indexOf(song),
            song.title,
            song.category
          );
          searchResult.hasChords = song.text.indexOf("<span>") >= 0;
          if (opts.addTextSnipped) {
            const normalizedText = this.normalizeText(song.text);
            searchResult.textSnipped = this.getTextSnipped(normalizedText);
          }
          result.push(searchResult);
        } else if (
          opts.includeText &&
          song.text.toLocaleLowerCase().indexOf(searchString2) >= 0
        ) {
          const searchResult = new SearchResult(
            this.songLib.indexOf(song),
            song.title,
            song.category
          );
          searchResult.hasChords = song.text.indexOf("<span>") >= 0;
          const normalizedText = this.normalizeText(song.text);
          const phrasePosition = normalizedText
            .toLocaleLowerCase()
            .indexOf(searchString);
          searchResult.phrase = normalizedText
            .substring(phrasePosition - 10, phrasePosition + 20)
            .trim();
          if (opts.addTextSnipped) {
            searchResult.textSnipped = this.getTextSnipped(normalizedText);
          }

          result.push(searchResult);
        }
      }
    });

    result.sort(this.alphabeticTitleComparator);
    return result;
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

  getTextSnipped = (input: string): string => {
    let response = "";
    const sentences = input.split(". ");
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
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\{\w*\}/gi, "")
      .replace(/<\/?\w*>/gi, "")
      .replace(/\[\w*\]/gi, "");
  };
}
