import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
import { Role } from '../dtos/user.DTO';
import { AgencySchema } from 'src/modules/Agences/schema/agency.schema';


@ObjectType()
export class Address {
  @Field({ nullable: true })
  @Column({ nullable: true })
  street?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city?: string;
}

@Entity({name: 'users'})
@ObjectType('User')
export class UserSchema {
  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectId;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password?: string;

  @Field(() => Role)
  @Column({default: Role.USER})
  role?: Role

  @Field()
  @Column()
  accessToken: string;

  @Field(() => ID)
  @Column("objectId")
  agencyId: ObjectId;
}
