export class SearchResult {
    public phrase: string;
    public hasChords: boolean;
    public textSnipped: string;

    public constructor(public id: number, public title: string, public category: string) {
    }
}