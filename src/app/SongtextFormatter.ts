import cheerio from "cheerio";
import * as fs from "fs";
import * as webshot from "webcap";
import { promisify } from "util";
import Song from "../models/Song";

const screenshot = promisify(webshot);

export default class SongtextFormatter {
  private tempFile = "/tmp/printFile.png";

  private template: string = fs.readFileSync(
    "dist/app/templates/SongPrint.html",
    "utf8"
  );

  private options: any = {
    // Don't change these values except you know what you're doing!!
    screenSize: {
      width: "384", // 384 is required by the printer
      height: "1", // 1px is minimal height
    },
    shotSize: {
      width: "384", // It's 384. Do not change!
      height: "all", // Use the height of the rendered page
    },
    siteType: "html", // We feed the browser with code.
    defaultWhiteBackground: true, // Must be true. Printer won't work with transparent images.
  };

  public generateSongtext = async (song: Song): Promise<string> => {
    try {
      const $ = cheerio.load(this.template);
      $("#songText").html(song.text);
      $("h2").html(song.title);
      if (song.hasChords) {
        $("#songText").addClass("chordline");
      }
      await screenshot($.html(), this.tempFile, this.options);

      return Promise.resolve("OK");
    } catch (err) {
      return Promise.reject(err);
    }
  };
}
