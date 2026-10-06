import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencySchema } from './schema/agency.schema';
import { AgencyResolver } from './resolvers/agence.resolver';
import { AgencyService } from './services/agences.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgencySchema])],
  providers: [AgencyResolver, AgencyService],
})
export class AgencyModule {}
