import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAgencyInput {
  @Field()
  agencyName: string;

  @Field(() => ID)
  ownerId: string;
}

@InputType()
export class UpdateAgencyInput {
  @Field({ nullable: true })
  agencyName?: string;

  @Field(() => ID, { nullable: true })
  ownerId?: string;
}