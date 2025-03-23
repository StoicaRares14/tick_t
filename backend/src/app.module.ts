import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '@events/events.entity';
import { Ticket } from '@tickets/tickets.entity';
import { User } from '@users/users.entity';

import { AuthResolver } from '@auth/auth.resolver';
import { EventsResolver } from '@events/events.resolver';
import { UsersResolver } from '@users/users.resolver';
import { TicketsResolver } from '@tickets/tickets.resolver';
import { AppService } from '@/app.service';

import { AuthModule } from '@auth/auth.module';
import { EventsModule } from '@events/events.module';
import { UsersModule } from '@users/users.module';
import { TicketsModule } from '@tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Event, Ticket],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Event, Ticket]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      include: [UsersModule, EventsModule, TicketsModule, AuthModule],
      autoSchemaFile: true,
      sortSchema: true,
    }),
    UsersModule,
    EventsModule,
    TicketsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    AppService,
    UsersResolver,
    EventsResolver,
    TicketsResolver,
    AuthResolver,
  ],
})
export class AppModule {}
