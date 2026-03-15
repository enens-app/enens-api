import { Args, extend, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Campagn, PaginatedCampgns } from '../schema/campagn.schema';
import { CampagnServices } from '../services/campagn.services';
import {
  CreateCampagnInput,
  FetchAllCampagnsArgs,
  FetchAllCampagnsByIdArgs,
  UpdateCampagnInput,
} from '../dtos/campagn.dtos';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-jwt-guard/gql-jwt-guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/helpers/current-user.deorator';
import { UserSchema } from 'src/modules/user/schema/user.schema';

@Resolver(() => [Campagn])
export class ProjectResolver {
  constructor(private readonly projectService: CampagnServices) {}

  @Query(() => PaginatedCampgns)
  async getAllCampagns(@Args('queries') queries: FetchAllCampagnsArgs) {
    return this.projectService.findAllCampagns(queries);
  }

  @Query(() => FetchAllCampagnsByIdArgs)
  async getUserCampagns(
    @Args('id', { type: () => String }) id: string,
  ): Promise<PaginatedCampgns> {
    return this.projectService.findUserCampagns(id);
  }

  @Query(() => Campagn)
  async findCampagnById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Campagn> {
    return this.projectService.findCampagnById(id);
  }

  @Mutation(() => Campagn)
  @UseGuards(GqlAuthGuard)
  async createNewCampagn(
    @Args('input') input: CreateCampagnInput,
    @CurrentUser() user,
  ): Promise<Campagn> {
    return await this.projectService.createNewCampagn(input, user._id);
  }

  @Mutation(() => Campagn)
  @UseGuards(GqlAuthGuard)
  async updateCampagnInput(
    @Args('input') input: UpdateCampagnInput,
    @CurrentUser() user: UserSchema,
  ): Promise<Campagn> {
    return await this.projectService.updateCampagn(input, String(user._id));
  }
}
