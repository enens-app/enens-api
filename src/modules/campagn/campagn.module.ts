import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectResolver } from "./resolvers/campagn.resolvers";
import { ProjectServices } from "./services/campagn.services";
import { Campagn } from "./schema/campagn.schema";

@Module({
  imports: [
    TypeOrmModule.forFeature([Campagn]),
  ],
  providers: [ProjectResolver, ProjectServices]
})

export class CampagnModules {};