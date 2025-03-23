import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';

import { Event } from '@events/events.entity';
import { User } from '@/users/users.entity';

@Entity({ name: 'Tickets' })
@ObjectType()
export class Ticket {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'date', nullable: false })
  @Field(() => Date)
  purchaseDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  qrCode?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  email: string;

  @ManyToOne(() => User, (user) => user.tickets)
  @Field(() => Int)
  user?: User;

  @ManyToOne(() => Event, (event) => event.tickets)
  @Field(() => Int)
  event: Event;
}
