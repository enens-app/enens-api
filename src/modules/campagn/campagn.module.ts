import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectResolver } from "./resolvers/campagn.resolvers";
import { CampagnServices } from "./services/campagn.services";
import { Campagn } from "./schema/campagn.schema";
import { GqlAuthGuard } from "../auth/guards/gql-jwt-guard/gql-jwt-guard";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Campagn]),
    AuthModule
  ],
  providers: [ProjectResolver, CampagnServices, GqlAuthGuard]
})

export class CampagnModules {};