import { Song } from './Song';

export type SearchResult = Song & {
  phrase?: string;
  textSnipped?: string;
};

export type SearchOptions = {
  chordsOnly?: boolean;
  includeTitle?: boolean;
  includeText?: boolean;
  addTextSnipped?: boolean;
};
