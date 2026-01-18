import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campagn } from '../schema/campagn.schema';
import { ObjectId } from 'mongodb';
import { CreateCampagnInput } from '../dtos/campagn.dtos';
import { CAMPAGN_TYPE } from '../enum';

@Injectable()
export class ProjectServices {
  constructor(
    @InjectRepository(Campagn)
    private readonly projectRepository: Repository<Campagn>,
  ) {};

  async findAllCampagns(): Promise<Campagn[]> {
    const projects = await this.projectRepository.find();
    return projects;
  };

  async findUserCampagns(authorId: string): Promise<Campagn[]> {
    const projects = await this.projectRepository.findBy({
      authorId: new ObjectId(authorId),
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
  ): Promise<Campagn> {

    const newCampagn = this.projectRepository.create({
      ...input,
      authorId: new ObjectId(input.authorId),
    });
    await this.projectRepository.save(newCampagn);

    return newCampagn;
  };
}
