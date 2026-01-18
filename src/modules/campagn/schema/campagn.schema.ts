import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { CAMPAGN_TYPE } from '../enum';

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

  @Field(() => ID)
  @Column()
  authorId: ObjectId;

  @Field(() => String, { nullable: true })
  @Column()
  thumbnailUrl?: string;

  @Field(() => String, { nullable: true })
  @Column()
  objectifAmount?: string;

  @Field(() => ID,{ nullable: true })
  @Column()
  entrepriseId?: ObjectId;

  @Field(() => String)
  @Column({ nullable: true })
  compagnyName?: string;

  @Field(() => [String])
  @Column()
  categories: string[];
  
  @Field(() => [String])
  @Column()
  subCategories: string[];
}
