import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Event } from '@events/events.entity';
import { AuthGuard } from '@auth/auth.guard';
import { RolesGuard } from '@roles/roles.guard';
import { Role } from '@/enums/role.enum';
import {
  CreateEventInput,
  EventInput,
  QueryEventInput,
} from '@events/events.input';
import { Roles } from '@roles/roles.decorator';

import { EventsService } from '@events/events.service';
import { EventResponse } from '@events/events.response';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}

  @Query(() => EventResponse)
  async findAllEvents(
    @Args('query', { type: () => QueryEventInput, nullable: true })
    query?: QueryEventInput,
  ): Promise<EventResponse> {
    return this.eventsService.findAll(query || { limit: 12 });
  }

  @Query(() => Event, { nullable: true })
  async findOneEvent(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Event | null> {
    return await this.eventsService.findOne(id);
  }

  @Query(() => Int)
  async countEvents(
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('location', { type: () => String, nullable: true }) location?: string,
    @Args('available', { type: () => Boolean, nullable: true })
    available?: boolean,
  ): Promise<number> {
    return await this.eventsService.count({ name, location, available });
  }

  @Mutation(() => Event)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async createEvent(
    @Args('event', { type: () => CreateEventInput })
    event: CreateEventInput | EventInput,
  ): Promise<Event> {
    return await this.eventsService.upsert(event);
  }

  @Mutation(() => Event)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateEvent(
    @Args('event') event: EventInput,
    @Args('id', { type: () => Int, nullable: true }) id?: number,
  ): Promise<Event> {
    return await this.eventsService.upsert(event, id);
  }
}
