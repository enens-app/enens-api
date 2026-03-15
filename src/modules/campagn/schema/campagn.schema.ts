import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { CAMPAGN_TYPE } from '../enum';
import { paginate, paginatedType } from 'src/pagination';

@ObjectType('Campagns')
@Entity({ name: 'campagns' })
export class Campagn {
  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectId;

  @Field(() => [CAMPAGN_TYPE], { nullable: true })
  @Column()
  campagnType?: CAMPAGN_TYPE[];

  @Field(() => String, { nullable: true })
  @Column()
  campagnName?: string;

  @Field(() => String, { nullable: true })
  @Column()
  description?: string;

  @Field(() => String, { nullable: true })
  @Column()
  thumbnailUrl?: string;

  @Field(() => String, { nullable: true })
  @Column()
  objectifAmount?: number;

  @Field(() => ID,{ nullable: true })
  @Column()
  entrepriseId?: ObjectId;

  @Field(() => String)
  @Column({ nullable: true })
  compagnyName?: string;

  @Field(() => String)
  @Column({ nullable: true })
  title?: string;

  @Field(() => [String])
  @Column()
  categories: string[];
  
  @Field(() => [String])
  @Column()
  subCategories: string[];

  @Field(() => ID)
  @Column()
  createdBy: ObjectId;

  @Field(() => ID)
  @Column()
  deletedBy: ObjectId;
  
  @Field(() => Date)
  @Column()
  deletedAt: Date;

  @Field(() => Date)
  @Column()
  createdAt: Date;

  @Field(() => ID, { nullable: true })
  @Column()
  updatedBy?: ObjectId;

  @Field(() => Date, { nullable: true })
  @Column()
  updatedAt?: Date;

  @Field(() => Boolean, { nullable: true })
  @Column()
  isDeleted?: boolean;
}

@ObjectType()
export class PaginatedCampgns extends paginatedType(Campagn) {}