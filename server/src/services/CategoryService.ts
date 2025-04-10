import { categoryRepository } from '../repositories/CategoryRepository';
import { ICategory } from '../entities/Categories';
import { CustomError } from '../middlewares/errorHandler';
import { STATUSCODE } from '../constants/StatusCodes';

export class CategoryService {
  async getAllCategories(): Promise<ICategory[]> {
    return categoryRepository.findAll();
  }

  async getCategoryById(categoryId: string): Promise<ICategory> {
    const category = await categoryRepository.findById(categoryId);
    
    if (!category) {
      throw new CustomError('Category not found', STATUSCODE.NOT_FOUND);
    }

    return category;
  }

  async createCategory(categoryName: string, description: string): Promise<ICategory> {

    const existingCategory = await categoryRepository.findByName(categoryName);
    
    if (existingCategory) {
      throw new CustomError('Category with this name already exists', STATUSCODE.BAD_REQUEST);
    }

    return categoryRepository.create({categoryName, description });
  }

  async updateCategory(categoryId: string, name: string, description: string): Promise<ICategory> {

    const category = await categoryRepository.findById(categoryId);
    
    if (!category) {
      throw new CustomError('Category not found', STATUSCODE.NOT_FOUND);
    }


    if (name !== category.categoryName) {
      const existingCategory = await categoryRepository.findByName(name);
      
      if (existingCategory) {
        throw new CustomError('Category with this name already exists', STATUSCODE.BAD_REQUEST);
      }
    }

    const updatedCategory = await categoryRepository.update(categoryId, { name, description });
    
    if (!updatedCategory) {
      throw new CustomError('Failed to update category', STATUSCODE.INTERNAL_SERVER_ERROR);
    }

    return updatedCategory;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const deleted = await categoryRepository.delete(categoryId);
    
    if (!deleted) {
      throw new CustomError('Category not found', STATUSCODE.NOT_FOUND);
    }
  }
}

export const categoryService = new CategoryService();