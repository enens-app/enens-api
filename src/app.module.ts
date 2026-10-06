import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './database/config/ormConfig';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JWTStrategy } from './modules/auth/strategies/jwt.strategie';
import { AgencyModule } from './modules/Agences/agency.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [ormConfig],
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot(ormConfig()),
    AuthModule,
    AgencyModule,
  ],
  providers: [AppService, AppController, JWTStrategy],
})
export class AppModule {}
