import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthPayload, ConnectUserInput, CreateUserInput } from "../user/dtos/user.DTO";
import { UserSchema } from "../user/schema/user.schema";
import { AuthService } from "./auth.service";
import { UnauthorizedException } from "@nestjs/common";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService){}

  @Mutation(() => UserSchema)
  signUp(@Args('input') input: CreateUserInput){
    return this.authService.registerUser(input);
  }
  
  @Mutation(() => AuthPayload)
  async login(@Args('input') input: ConnectUserInput, @Context() context){
    const user = await this.authService.validateUser(input);
    const { accessToken, role, userId } = await this.authService.login(user);
    
    context.res.cookie('acessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, role, userId }
  }

  @Query(() => UserSchema)
  async currentUser(@Context('req') req) {
    const token = req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.authService.getCurrentUserFromToken(token);
  }

  @Query(() => UserSchema)
  async getUserById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserSchema> {
    const user = this.authService.findById(id);
    return user;
  }

}