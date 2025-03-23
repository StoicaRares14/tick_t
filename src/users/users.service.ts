import * as bcrypt from 'bcrypt';
import { FindOperator, LessThanOrEqual, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@users/users.entity';
import { CreateUserInput, QueryUserInput, UserInput } from '@users/users.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    query: QueryUserInput,
  ): Promise<{ users?: User[]; next?: number }> {
    const findQuery: QueryUserInput & { id?: FindOperator<number> } = query;
    if (findQuery.from) {
      findQuery.id = LessThanOrEqual(findQuery.from);
      delete findQuery.from;
    }

    const users = await this.usersRepository.find({
      where: findQuery,
    });

    if (users.length <= 1) {
      return { users };
    }

    return {
      users: users.slice(0, query.limit),
      next: users[query.limit]?.id,
    };
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async create(userData: CreateUserInput): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  async update(user: UserInput, id: number): Promise<User> {
    return await this.usersRepository.save({ id, ...user });
  }

  async updatePassword(
    oldPassword: string,
    newPassword: string,
    username: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
