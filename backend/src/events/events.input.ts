import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  ticketCount: number;

  @Field(() => Int)
  purchasedCount: number;

  @Field({ nullable: true })
  cover?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  time?: string;
}

@InputType()
export class EventInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  ticketCount?: number;

  @Field(() => Int, { nullable: true })
  purchasedCount?: number;

  @Field({ nullable: true })
  cover?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  time?: string;
}

@InputType()
export class QueryEventInput extends EventInput {
  @Field(() => Int, { nullable: true })
  limit: number = 12;

  @Field(() => Int, { nullable: true })
  from?: number;
}
