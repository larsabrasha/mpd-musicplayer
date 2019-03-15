import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MpdService } from './mpd/mpd.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MpdService],
})
export class AppModule {}
