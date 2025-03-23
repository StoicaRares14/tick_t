import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Ticket } from '@tickets/tickets.entity';

@ObjectType()
export class TicketResponse {
  @Field(() => [Ticket], { nullable: true })
  tickets?: Ticket[];

  @Field(() => Int, { nullable: true })
  next?: number;
}
