import SongtextFormatter from "./SongtextFormatter";

export default class PrinterService {
  private formatter: SongtextFormatter = new SongtextFormatter();

  public printSong = async (song: any): Promise<void> => {
    await this.formatter.generateSongtext(song);
  };
}
