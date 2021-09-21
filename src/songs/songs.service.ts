import { Injectable } from '@nestjs/common';
import { DatabaseInfo } from './types/DatabaseInfo';
import SongDatabase from './SongDatabase';
import { SearchOptions, SearchResult } from './types/Search';

const database = new SongDatabase();

@Injectable()
export class SongsService {
  findSongs(query: string, options: SearchOptions): SearchResult[] {
    return database.findSongByString(query, options);
  }

  getSong(songId: number) {
    return database.getSongById(songId);
  }

  getDatabaseInfo(): DatabaseInfo {
    const numberOfSongs = database.getSize();

    return {
      numberOfSongs,
    };
  }
}
