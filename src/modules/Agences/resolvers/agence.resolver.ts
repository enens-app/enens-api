import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AgencyService } from '../services/agences.service';
import { AgencySchema } from '../schema/agency.schema';
import { CreateAgencyInput, UpdateAgencyInput } from '../dtos/agence.dtos';

@Resolver(() => AgencySchema)
export class AgencyResolver {
  constructor(private readonly agencyService: AgencyService) {}

  @Mutation(() => AgencySchema)
  async createAgency(@Args('input') input: CreateAgencyInput) {
    return this.agencyService.createAgency(input);
  }

  @Query(() => [AgencySchema])
  async agencies() {
    return this.agencyService.findAll();
  }

  @Query(() => AgencySchema)
  async agency(@Args('id', { type: () => ID }) id: string) {
    return this.agencyService.findById(id);
  }

  @Query(() => [AgencySchema])
  async agenciesByOwner(@Args('ownerId', { type: () => ID }) ownerId: string) {
    return this.agencyService.findByOwnerId(ownerId);
  }

  @Mutation(() => AgencySchema)
  async updateAgency(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAgencyInput,
  ) {
    return this.agencyService.updateAgency(id, input);
  }

  @Mutation(() => AgencySchema)
  async deleteAgency(@Args('id', { type: () => ID }) id: string) {
    return this.agencyService.deleteAgency(id);
  }
}
