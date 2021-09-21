import { Controller, Get, Param, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { DatabaseInfo } from './types/DatabaseInfo';
import { SearchOptions, SearchResult } from './types/Search';
import { Song } from './types/Song';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  getDatabaseInfo(): DatabaseInfo {
    return this.songsService.getDatabaseInfo();
  }

  @Get('search')
  searchSongs(
    @Query('q') query: string,
    @Query('includeTitle') includeTitle: string,
    @Query('includeText') includeText: string,
    @Query('chordsOnly') chordsOnly: string,
    @Query('addTextSnipped') addTextSnipped: string,
  ): SearchResult[] {
    const options: SearchOptions = {
      chordsOnly: chordsOnly === 'true',
      includeText: includeText === 'true',
      includeTitle: includeTitle === 'true',
      addTextSnipped: addTextSnipped === 'true',
    };
    return this.songsService.findSongs(query, options);
  }

  @Get('*')
  getSong(@Param() params: string[]): Song {
    const songId = Number(params[0]);

    return this.songsService.getSong(songId);
  }
}
