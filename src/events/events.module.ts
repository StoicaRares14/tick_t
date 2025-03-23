import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '@events/events.entity';

import { EventsService } from '@events/events.service';
import { EventsResolver } from '@events/events.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService, EventsResolver],
  exports: [EventsService],
})
export class EventsModule {}
