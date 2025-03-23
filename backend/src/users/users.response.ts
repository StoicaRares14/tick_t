import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '@users/users.entity';

@ObjectType()
export class UserResponse {
  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => Int, { nullable: true })
  next?: number;
}
