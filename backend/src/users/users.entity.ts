import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';

import { Ticket } from '@tickets/tickets.entity';
import { Role } from '@/enums/role.enum';

@Entity({ name: 'Users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  password: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  secondName: string;

  @Column({ type: 'json', default: ['user'] })
  @Field(() => [String], { defaultValue: ['user'] })
  roles: Role[];

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  birthDate?: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
