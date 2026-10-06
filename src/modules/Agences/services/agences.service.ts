import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { AgencySchema } from '../schema/agency.schema';
import { CreateAgencyInput, UpdateAgencyInput } from '../dtos/agence.dtos';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(AgencySchema)
    private agencyRepo: Repository<AgencySchema>,
  ) {}

  async createAgency(input: CreateAgencyInput) {
    const { agencyName, ownerId } = input;

    const newAgency = this.agencyRepo.create({
      agencyName,
      ownerId: new ObjectId(ownerId),
    });

    return this.agencyRepo.save(newAgency);
  }

  async findAll() {
    return this.agencyRepo.find();
  }

  async findById(id: string) {
    const agency = await this.agencyRepo.findOneBy({
      _id: new ObjectId(id),
    });

    if (!agency) {
      throw new NotFoundException(`Agency with id ${id} not found`);
    }

    return agency;
  }

  async findByOwnerId(ownerId: string) {
    return this.agencyRepo.find({
      where: {
        ownerId: new ObjectId(ownerId),
      },
    });
  }

  async updateAgency(id: string, input: UpdateAgencyInput) {
    const agency = await this.findById(id);

    if (input.agencyName !== undefined) {
      agency.agencyName = input.agencyName;
    }

    if (input.ownerId !== undefined) {
      agency.ownerId = new ObjectId(input.ownerId);
    }

    return this.agencyRepo.save(agency);
  }

  async deleteAgency(id: string) {
    const agency = await this.findById(id);

    await this.agencyRepo.delete({
      _id: agency._id,
    });

    return agency;
  }
}
