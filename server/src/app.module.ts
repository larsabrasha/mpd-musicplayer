import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events.gateway';
import { MpdService } from './mpd/mpd.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MpdService, EventsGateway],
})
export class AppModule {}
