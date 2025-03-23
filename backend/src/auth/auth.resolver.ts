import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { SignInInput } from '@auth/auth.input';
import { SignInResponse } from '@auth/auth.response';

import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignInResponse)
  signIn(
    @Args('signInDto', { type: () => SignInInput })
    signInDto: SignInInput,
  ): Promise<SignInResponse> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  //TODO implement refresh tokens
  @UseGuards(AuthGuard)
  @Query(() => String)
  getProfile(@Args('req', { type: () => String }) token: string): string {
    return token;
  }
}
