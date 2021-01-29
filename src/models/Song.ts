export class Song {
    public title: string;
    public author: string;
    public melody: string;
    public category: string;
    public text: string;
    public phrase: string;
    public hasChords: boolean;

    public constructor(rawSong: any) {
        this.title = rawSong.title;
        this.hasChords = rawSong.text.indexOf('{') >= 0;
        this.text = rawSong.text.replace(/\n\s*\n\s*/gm, '<br><br>').replace(/\n\s*/gm, '<br>').replace(/\{(\w*?)\}([^\{\<]*)/gi, '<span><strong><span>[</span>$1<span>]</span></strong>$2</span>');
        this.category = rawSong.category;
    }
}