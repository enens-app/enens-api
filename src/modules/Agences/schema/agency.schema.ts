import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'Agencies' })
@ObjectType('Agency')
export class AgencySchema {
  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectId;

  @Field()
  @Column()
  agencyName: string;

  @Field(() => ID)
  @Column('objectId')
  ownerId: ObjectId;
}
