import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from '../user/schema/user.schema';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTStrategy } from './strategies/jwt.strategie';
import { AgencySchema } from '../Agences/schema/agency.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema, AgencySchema]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: configService.get<string>("JWT_EXPIRES_IN") },
      })
    }),
  ],
  providers: [AuthService, AuthResolver, JWTStrategy],
  exports: [AuthService]
})
export class AuthModule {}
