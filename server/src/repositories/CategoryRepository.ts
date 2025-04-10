import Category from '../entities/Categories';
import { ICategory } from '../entities/Categories';
import { BaseRepository } from './BaseRepository';


export interface ICategoryRepository extends BaseRepository<ICategory> {
  findByName(name: string): Promise<ICategory | null>;
}

export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
  constructor() {
    super(Category);
  }

  async findByName(name: string): Promise<ICategory | null> {
    return Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }).exec();
  }
}

export const categoryRepository = new CategoryRepository();