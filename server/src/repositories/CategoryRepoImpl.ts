import { ICategory } from "../entities/Categories";
import Category from "../entities/Categories";
import { ICategoryRepository } from "../Interfaces/CategoryRepo";
import { BaseRepository } from "./BaseRepoImpl";







export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
  constructor() {
    super(Category);
  }

  async findByName(name: string): Promise<ICategory | null> {
    return Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }).exec();
  }
}

