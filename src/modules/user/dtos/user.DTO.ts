import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
registerEnumType(Role, {
  name: 'Role',
  description: 'The role of the user in the system',
});

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  accessToken?: string;
  
  @Field({ nullable: true })
  agencyName?: string;
}

@InputType()
export class ConnectUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  userId: string;

  @Field()
  role: Role;

  @Field()
  accessToken: string;
}

export type AuthJWTPayload = {
  sub: {
    userId: string;
  };
};
export type JWTUser = {
  userId: string;
  role: Role;
};
