import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { UserSchema } from 'src/modules/user/schema/user.schema';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.getArgByIndex(2);
    const authHeader = ctx.req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader.split(' ')[1];
    const user = await this.authService.getCurrentUserFromToken(token);
    ctx.user = user as UserSchema;
    return true;
  }
}