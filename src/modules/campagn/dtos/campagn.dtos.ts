import { Field, InputType } from "@nestjs/graphql";
import { CAMPAGN_TYPE } from "../enum";
import { ObjectId } from "mongodb";

@InputType()
export class CreateCampagnInput {
  @Field({ nullable: true })
  campagnName?: string

  @Field({ nullable: true })
  title?: string

  @Field(() => [CAMPAGN_TYPE], { nullable: true })
  campagnType?: CAMPAGN_TYPE[]

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field({ nullable: true })
  compagnyName?: string;

  @Field(() => String, { nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  contry?: string;

  @Field(() => [String])
  categories: string[];

  @Field(() => [String])
  subCategories: string[];
};

@InputType()
export class UpdateCampagnInput {
  @Field(() => String)
  id: string;

  updatedBy?: ObjectId;
  updatedAt?: Date;

  @Field({ nullable: true })
  campagnName?: string

  @Field({ nullable: true })
  title?: string

  @Field(() => [CAMPAGN_TYPE], { nullable: true })
  campagnType?: CAMPAGN_TYPE[]

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field({ nullable: true })
  compagnyName?: string;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  contry?: string;

  @Field(() => [String], { nullable: true })
  categories?: string[];

  @Field(() => [String], { nullable: true })
  subCategories?: string[];
};
