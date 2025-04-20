import { ICategory } from "../entities/Categories";
import { BaseRepository } from "../repositories/BaseRepoImpl";




export interface ICategoryRepository extends BaseRepository<ICategory> {
    findByName(name: string): Promise<ICategory | null>;
  }