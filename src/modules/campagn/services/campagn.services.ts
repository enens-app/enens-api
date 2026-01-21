import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campagn } from '../schema/campagn.schema';
import { ObjectId } from 'mongodb';
import { CreateCampagnInput, UpdateCampagnInput } from '../dtos/campagn.dtos';
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
