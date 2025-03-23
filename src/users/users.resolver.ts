import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '@auth/auth.guard';
import { Roles } from '@roles/roles.decorator';
import { RolesGuard } from '@roles/roles.guard';
import { User } from '@users/users.entity';
import { CurrentUser } from '@users/users.decorator';
import { CreateUserInput, QueryUserInput, UserInput } from '@users/users.input';
import { UserResponse } from '@users/users.response';
import { Role } from '@/enums/role.enum';

import { UsersService } from '@users/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  //for admin page
  @Query(() => UserResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAllUsers(
    @Args('query', { type: () => QueryUserInput, nullable: true })
    query: QueryUserInput = { limit: 12 },
  ): Promise<UserResponse> {
    return await this.usersService.findAll(query);
  }

  @Query(() => User, { nullable: true })
  async findOneUser(@Args('username') username: string): Promise<User | null> {
    return await this.usersService.findOne(username);
  }

  @Mutation(() => User)
  async createUser(
    @Args('user', { type: () => CreateUserInput }) user: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.create(user);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async updateUser(
    @CurrentUser() authUser: User,
    @Args('user', { type: () => UserInput }) user: UserInput,
    @Args('id', { type: () => Int, nullable: true }) id?: number,
  ): Promise<User> {
    const userId = id || authUser.id;
    return await this.usersService.update(user, userId);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async updateUserPassword(
    @Args('user', { type: () => UserInput }) user: UserInput,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return await this.usersService.update(user, id);
  }
}
