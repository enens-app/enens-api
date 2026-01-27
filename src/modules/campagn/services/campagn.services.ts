import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectLiteral, Repository } from 'typeorm';
import { Campagn } from '../schema/campagn.schema';
import { ObjectId } from 'mongodb';
import { CreateCampagnInput, FetchAllCampagnsArgs, UpdateCampagnInput } from '../dtos/campagn.dtos';
import { paginate } from 'src/pagination';

@Injectable()
export class ProjectServices {
  constructor(
    @InjectRepository(Campagn)
    private readonly projectRepository: MongoRepository<Campagn>,
  ) {};

  async findAllCampagns(queries: FetchAllCampagnsArgs) {
    const { limit, page, searchText } = queries;
    
    const query: ObjectLiteral = {
    }
    if (searchText) query.campagnName = { $regex: searchText, $options: "i" };
    return await paginate({
      repo: this.projectRepository,
      order: {
        createdAt: "DESC"
      },
      query,
      limit,
      page,
    })
  };

  async findUserCampagns(id: string): Promise<Campagn[]> {
    const projects = await this.projectRepository.findBy({
      createdBy: new ObjectId(id),
    });
    return projects;
  };

  async findCampagnById(id: string): Promise<Campagn>{
    const project = await this.projectRepository.findOneBy({
      _id: new ObjectId(id),
    })
    return project;
  };

  async createNewCampagn(
    input: CreateCampagnInput,
    id: string
  ): Promise<Campagn> {

    const newCampagn = this.projectRepository.create({
      ...input,
      createdBy: new ObjectId(id),
    });
    await this.projectRepository.save(newCampagn);

    return newCampagn;
  };

  async updateCampagn(
    input: UpdateCampagnInput,
    updatedBy: string,
  ): Promise<Campagn> {
    const campagn = await this.findCampagnById(input.id);
  if (!campagn) throw new NotFoundException('Campagn not found');

  const updatedCampagn = this.projectRepository.merge(campagn, {
    ...input,
    updatedBy: updatedBy,
    updatedAt: new Date(),
  });

  return this.projectRepository.save(updatedCampagn)
  }
}
