
import { STATUSCODE } from '../constants/StatusCodes';
import { ICategory } from '../entities/Categories';
import { CustomError } from '../middlewares/errorHandler';
import { ICategoryService } from '../Interfaces/CategoryServiceInterface';
import { ICategoryRepository } from '../Interfaces/CategoryRepo';

export class CategoryService implements ICategoryService {

  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository
  }

  async getAllCategories(): Promise<ICategory[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(categoryId: string): Promise<ICategory> {
    const category = await this.categoryRepository.findById(categoryId);
    
    if (!category) {
      throw new CustomError('Category not found', STATUSCODE.NOT_FOUND);
    }

    return category;
  }

  async createCategory(categoryName: string, description: string): Promise<ICategory> {

    const existingCategory = await this.categoryRepository.findByName(categoryName);
    
    if (existingCategory) {
      throw new CustomError('Category with this name already exists', STATUSCODE.BAD_REQUEST);
    }

    return this.categoryRepository.create({categoryName, description });
  }

  async updateCategory(categoryId: string, name: string, description: string): Promise<ICategory> {

    const category = await this.categoryRepository.findById(categoryId);
    
    if (!category) {
      throw new CustomError('Category not found', STATUSCODE.NOT_FOUND);
    }


    if (name !== category.categoryName) {
      const existingCategory = await this.categoryRepository.findByName(name);
      
      if (existingCategory) {
        throw new CustomError('Category with this name already exists', STATUSCODE.BAD_REQUEST);
      }
    }

    const updatedCategory = await this.categoryRepository.update(categoryId, { name, description });
    
    if (!updatedCategory) {
      throw new CustomError('Failed to update category', STATUSCODE.INTERNAL_SERVER_ERROR);
    }

    return updatedCategory;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const deleted = await this.categoryRepository.delete(categoryId);
    
    if (!deleted) {
      throw new CustomError('Category not found', STATUSCODE.NOT_FOUND);
    }
  }
}

