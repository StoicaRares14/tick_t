import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '@auth/auth.guard';
import { Role } from '@/enums/role.enum';
import { Roles } from '@roles/roles.decorator';
import { RolesGuard } from '@roles/roles.guard';
import { Ticket } from '@tickets/tickets.entity';
import {
  CreateTicketInput,
  QueryTicketInput,
  TicketInput,
} from '@tickets/tickets.input';
import { TicketResponse } from '@tickets/tickets.response';

import { TicketsService } from '@tickets/tickets.service';

@Resolver(() => Ticket)
export class TicketsResolver {
  constructor(private ticketsService: TicketsService) {}

  @Query(() => TicketResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async findAllTickets(
    @Args('query', { type: () => QueryTicketInput, nullable: true })
    query: QueryTicketInput = { limit: 12 },
  ): Promise<TicketResponse> {
    return this.ticketsService.findAll(query);
  }

  @Query(() => Ticket, { nullable: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async findOneTicket(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Ticket | null> {
    return await this.ticketsService.findOne(id);
  }

  @Query(() => Int)
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  async countTickets(
    @Args('purchaseDate', { type: () => Date, nullable: true })
    purchaseDate?: Date,
    @Args('eventId', { type: () => Int, nullable: true }) eventId?: number,
  ): Promise<number> {
    return await this.ticketsService.count({ purchaseDate, eventId });
  }

  @Mutation(() => Ticket)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async createTicket(
    @Args('tickets', { type: () => [CreateTicketInput] })
    tickets: CreateTicketInput[],
  ): Promise<Ticket[]> {
    return await this.ticketsService.create(tickets);
  }

  @Mutation(() => Ticket)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async updateTicket(
    @Args('ticket', { type: () => TicketInput }) ticket: TicketInput,
    @Args('id', { type: () => Int, nullable: true }) id: number,
  ): Promise<Ticket> {
    return await this.ticketsService.update(ticket, id);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async deleteTicket(
    @Args('id', { type: () => Int, nullable: true }) id: number,
  ) {
    await this.ticketsService.remove(id);
    return id;
  }
}
