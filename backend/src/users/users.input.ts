import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  secondName: string;

  @Field({ nullable: true })
  birthDate?: Date;
}

@InputType()
export class UserInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  secondName?: string;

  @Field({ nullable: true })
  birthDate?: Date;
}

@InputType()
export class QueryUserInput extends UserInput {
  @Field(() => Int, { nullable: true })
  limit: number = 12;

  @Field(() => Int, { nullable: true })
  from?: number;
}
