import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectLiteral, Repository } from 'typeorm';
import { Campagn } from '../schema/campagn.schema';
import { ObjectId } from 'mongodb';
import {
  CreateCampagnInput,
  FetchAllCampagnsArgs,
  UpdateCampagnInput,
} from '../dtos/campagn.dtos';
import { paginate } from 'src/pagination';

@Injectable()
export class CampagnServices {
  constructor(
    @InjectRepository(Campagn)
    private readonly projectRepository: MongoRepository<Campagn>,
  ) {}

  async findAllCampagns(queries: FetchAllCampagnsArgs) {
    const { limit, page, searchText } = queries;

    const query: ObjectLiteral = {};
    query.isDeleted = { $ne: true };
    if (searchText) query.campagnName = { $regex: searchText, $options: 'i' };
    return await paginate({
      repo: this.projectRepository,
      order: {
        createdAt: 'DESC',
      },
      query,
      limit,
      page,
    });
  }

  async findUserCampagns(id: string) {
    const campagn = await this.projectRepository.findBy({
      createdBy: new ObjectId(id),
    });

    const query: ObjectLiteral = {};
    query.isDeleted = { $ne: true };
    if (!campagn) throw new NotFoundException('Campagn not found');

    return await paginate({
      repo: this.projectRepository,
      order: {
        createdAt: 'DESC',
      },
      query,
      limit: 10,
      page: 1,
    });
  }

  async findCampagnById(id: string): Promise<Campagn> {
    const project = await this.projectRepository.findOneBy({
      _id: new ObjectId(id),
    });
    return project;
  }

  async createNewCampagn(
    input: CreateCampagnInput,
    id: string,
  ): Promise<Campagn> {
    const newCampagn = this.projectRepository.create({
      ...input,
      title: "Sans titre",
      createdBy: new ObjectId(id),
    });
    await this.projectRepository.save(newCampagn);

    return newCampagn;
  }

  async updateCampagn(
    input: UpdateCampagnInput,
    updatedBy: string,
  ): Promise<Campagn> {
    const campagn = await this.findCampagnById(input.id);
    if (!campagn) throw new NotFoundException('Campagn not found');

    const updatedCampagn = this.projectRepository.merge(campagn, {
      ...input,
      updatedBy: new ObjectId(updatedBy),
      updatedAt: new Date(),
    });

    return this.projectRepository.save(updatedCampagn);
  }

  async deleteCampagn(id: string, deletedBy: string): Promise<Campagn> {
    const campagn = await this.findCampagnById(id);

    if (campagn.createdBy.toString() !== deletedBy) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à suprimer cette campagne",
      );
    }
    const deleted = this.projectRepository.merge(campagn, {
      isDeleted: true,
      deletedBy: new ObjectId(deletedBy),
      deletedAt: new Date(),
    });

    return this.projectRepository.save(deleted);
  };
};
