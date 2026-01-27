import { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MongoRepository, ObjectLiteral } from "typeorm";

export enum operationType {
  Find = "FIND",
  Aggregate = "AGGREGATE"
}

const LIMIT = 1000;
const PAGE = 1;
export const LIMIT_EXPORT_PARCEL = 5000;
export const LIMIT_NEW_EXPORT_PARCEL = 10000;

interface offsetArgs<T> {
  repo: MongoRepository<T>;
  query?: ObjectLiteral;
  pipeline?: ObjectLiteral[];
  type?: operationType;
  page?: number;
  limit?: number;
  countByMethod?: boolean;
  order: Partial<Record<keyof T, "ASC" | "DESC">>;
}

export interface IPaginatedType<T> {
  totalPages: number;
  data: T[];
  countTotal: number;
  currentPage: number;
}

export function paginatedType<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => Int, { nullable: true })
    countTotal: number;
    @Field(() => Int, { nullable: true })
    currentPage: number;
    @Field(() => [classRef], { nullable: "itemsAndList" })
    data: T[];
    @Field(() => Int, { nullable: true })
    totalPages: number;
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}

export async function paginate<T>({
  repo,
  query,
  pipeline,
  page = PAGE,
  limit = LIMIT,
  type = operationType.Find,
  countByMethod = false,
  order
}: offsetArgs<T>) {
  limit = Math.min(limit, LIMIT)
  let totalPages: number = 0;
  let data: T[] = [];
  let countTotal: number = 0;
  let currentPage: number = 0;
  if (type === operationType.Find) {
    const count = await repo.count(query);
    const docs = await repo.find({
      where: { ...query },
      skip: (page - 1) * limit,
      take: limit,
      order
    });
    totalPages = count ? Math.ceil(count / limit) : 0;
    data = docs;
    countTotal = count;
    currentPage = page;
  } else {
    const skipStage = { $skip: (page - 1) * limit };
    const limitStage = { $limit: limit };

    const countPipeline = [...pipeline, { $count: "count" }];

    const filterStage = pipeline.find((stage) => stage.$match);
    const { $match: query } = filterStage ? filterStage : { $match: {} };

    const result: any = countByMethod
      ? { count: await repo.count(query) }
      : (await repo.aggregate<{ count: number }>(countPipeline).toArray())[0];

    const docs = repo.aggregate<T>([...pipeline, skipStage, limitStage]);

    totalPages = result?.count ? Math.ceil(result.count / limit) : 0;
    data = await docs.toArray();
    countTotal = totalPages > 0 ? result?.count : 0;
    currentPage = page;
  }
  return {
    totalPages,
    data,
    countTotal,
    currentPage
  };
}
