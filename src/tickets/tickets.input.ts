import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTicketInput {
  @Field(() => Date)
  purchaseDate: Date;

  @Field({ nullable: true })
  qrCode?: string;

  @Field({ nullable: true })
  email: string;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  eventId: number;
}

@InputType()
export class TicketInput {
  @Field(() => Date)
  purchaseDate?: Date;

  @Field({ nullable: true })
  qrCode?: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  eventId: number;
}

@InputType()
export class QueryTicketInput {
  @Field(() => Int, { nullable: true })
  eventId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Date, { nullable: true })
  purchaseDate?: Date;

  @Field(() => Int, { nullable: true })
  limit: number = 12;

  @Field(() => Int, { nullable: true })
  from?: number;
}
