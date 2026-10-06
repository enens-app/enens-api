import { ObjectType } from "@nestjs/graphql";
import { Entity } from "typeorm";



@Entity({ name: 'Propreties' })
@ObjectType('Proprety')
export class PropretySchema {

}