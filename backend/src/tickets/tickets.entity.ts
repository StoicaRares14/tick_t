import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
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

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  eventId: number;

  @ManyToOne(() => Event, (event) => event.tickets)
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
