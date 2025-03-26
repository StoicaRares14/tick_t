import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

import { Ticket } from '@tickets/tickets.entity';

@Entity({ name: 'Events' })
@ObjectType()
export class Event {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  ticketCount: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  purchasedCount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  cover?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  location?: string;

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  date?: Date;

  @Column({ type: 'float', nullable: true })
  @Field(() => Float, { nullable: true })
  price?: number;

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  time?: string;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];
}
