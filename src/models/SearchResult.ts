export default class SearchResult {
  public phrase: string;

  public hasChords: boolean;

  public textSnipped: string;

  public id: number;

  public title: string;

  public category: string;

  public constructor(id: number, title: string, category: string) {
    this.id = id;
    this.title = title;
    this.category = category;
  }
}
