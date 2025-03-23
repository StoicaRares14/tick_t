import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Event } from '@events/events.entity';

@ObjectType()
export class EventResponse {
  @Field(() => [Event], { nullable: true })
  events?: Event[];

  @Field(() => Int, { nullable: true })
  next?: number;
}
