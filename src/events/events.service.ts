import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './events.entity';
import { CreateEventInput, EventInput, QueryEventInput } from './events.input';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAll(
    query: QueryEventInput,
  ): Promise<{ events?: Event[]; next?: number }> {
    let q = `select * from "Events"`;

    const where = Object.entries(query).reduce<string[]>(
      (acc, [key, value]) => {
        if (typeof value === 'undefined' || key === 'limit') return acc;

        if (key === 'from') {
          return [...acc, `id <= ${value}`];
        }

        if (key === 'available') {
          if (value === true) {
            return [...acc, `"purchasedCount" < "ticketCount"`];
          }
          return [...acc, `"purchasedCount" >= "ticketCount"`];
        }

        if (typeof value === 'string') {
          return [...acc, `"${key}" = '${value}'`];
        }

        return [...acc, `"${key}" = ${value}`];
      },
      [],
    );

    if (where.length > 0) {
      q += ` where `;
      q += where.join(' and ');
    }

    q += ` order by id desc limit ${query.limit + 1}`;

    const events = await this.eventsRepository.query(q);
    if (events.length <= 1) {
      return { events };
    }

    return {
      events: events.slice(0, query.limit),
      next: events[query.limit]?.id,
    };
  }

  async findOne(id: number): Promise<Event | null> {
    return this.eventsRepository.findOneBy({ id });
  }

  async count(query: {
    name?: string;
    location?: string;
    available?: boolean;
  }): Promise<number> {
    let q = `select count(*) from "Events"`;

    const where = Object.entries(query).reduce<string[]>(
      (acc, [key, value]) => {
        if (typeof value === 'undefined') return acc;

        if (key === 'from') {
          return [...acc, `id <= ${value}`];
        }

        if (key === 'available') {
          if (value === true) {
            return [...acc, `"purchasedCount" < "ticketCount"`];
          }
          return [...acc, `"purchasedCount" >= "ticketCount"`];
        }

        if (typeof value === 'string') {
          return [...acc, `"${key}" = '${value}'`];
        }

        return [...acc, `"${key}" = ${value}`];
      },
      [],
    );

    if (where.length > 0) {
      q += ` where `;
      q += where.join(' and ');
    }

    return await this.eventsRepository.query(q);
  }

  async upsert(
    event: CreateEventInput | EventInput,
    id?: number,
  ): Promise<Event> {
    const input: (CreateEventInput | EventInput) & { id?: number } = event;
    if (id) {
      input.id = id;
    }

    return await this.eventsRepository.save(input);
  }

  async remove(id: number): Promise<void> {
    await this.eventsRepository.delete(id);
  }
}
