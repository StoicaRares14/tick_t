import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticket } from './tickets.entity';

import { EventsService } from '@events/events.service';
import { TicketsResolver } from '@tickets/tickets.resolver';
import { TicketsService } from '@tickets/tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    TypeOrmModule.forFeature([Event]),
  ],
  providers: [TicketsService, TicketsResolver, EventsService],
  exports: [TicketsService],
})
export class TicketsModule {}
