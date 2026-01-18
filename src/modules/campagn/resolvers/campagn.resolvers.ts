import { Args, extend, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Campagn } from '../schema/campagn.schema';
import { ProjectServices } from '../services/campagn.services';
import { CreateCampagnInput } from '../dtos/campagn.dtos';

// import { UseGuards } from '@nestjs/common';

@Resolver(() => [Campagn])
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectServices,
  ) {};

  @Query(() => [Campagn])
  async getAllCampagns(): Promise<Campagn[]> {
    return this.projectService.findAllCampagns();
  };

  @Query(() => [Campagn])
  async getUserCampagns(
    @Args('authorId', { type: () => String }) authorId: string,
  ): Promise<Campagn[]> {
    return this.projectService.findUserCampagns(authorId);
  };

  @Query(() => Campagn)
  async findCampagnById(@Args("id", { type: () => String }) id: string,): Promise<Campagn> {
    return this.projectService.findCampagnById(id);
  };

  @Mutation(() => Campagn)
  async createNewCampagn(
    @Args('input') input: CreateCampagnInput,
  ): Promise<Campagn> {
    return await this.projectService.createNewCampagn(input);
  };
}
