import { FindOperator, LessThanOrEqual, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Ticket } from '@tickets/tickets.entity';
import {
  TicketInput,
  QueryTicketInput,
  CreateTicketInput,
} from '@tickets/tickets.input';

import { EventsService } from '@events/events.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private eventsService: EventsService,
  ) {}

  async findAll(
    query: QueryTicketInput,
  ): Promise<{ tickets?: Ticket[]; next?: number }> {
    const findQuery: QueryTicketInput & { id?: FindOperator<number> } = query;
    if (findQuery.from) {
      findQuery.id = LessThanOrEqual(findQuery.from);
      delete findQuery.from;
    }

    const tickets = await this.ticketsRepository.find({
      where: findQuery,
    });

    if (tickets.length <= 1) {
      return { tickets };
    }

    return {
      tickets: tickets.slice(0, query.limit),
      next: tickets[query.limit]?.id,
    };
  }

  async findOne(id: number): Promise<Ticket | null> {
    return this.ticketsRepository.findOneBy({ id });
  }

  async count(query: {
    eventId?: number;
    purchaseDate?: Date;
  }): Promise<number> {
    const countQuery = Object.entries(query).reduce((acc, [key, value]) => {
      if (typeof value === 'undefined') return acc;

      return { ...acc, [key]: value };
    }, {});

    return await this.ticketsRepository.count({
      where: countQuery,
    });
  }

  async create(tickets: CreateTicketInput[]): Promise<Ticket[]> {
    const event = await this.eventsService.findOne(tickets[0].eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (event?.purchasedCount + tickets.length > event?.ticketCount) {
      throw new Error('Ticket count exceeded');
    }

    const createdTickets = await this.ticketsRepository.save(tickets, {
      transaction: true,
    });

    await this.eventsService.upsert(
      { purchasedCount: event.purchasedCount + tickets.length },
      event.id,
    );

    return createdTickets;
  }

  async update(ticket: TicketInput, id: number): Promise<Ticket> {
    return await this.ticketsRepository.save({ id, ...ticket });
  }

  async remove(id: number) {
    await this.ticketsRepository.delete(id);
  }
}
