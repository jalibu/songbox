import { Module } from '@nestjs/common';
import { SongsController } from './songs/songs.controller';
import { SongsService } from './songs/songs.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static_html'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class AppModule {}
