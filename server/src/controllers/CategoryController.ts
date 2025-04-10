import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/CategoryService';
import { STATUSCODE } from '../constants/StatusCodes';

export class CategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();

      res.status(STATUSCODE.OK).json({
        success: true,
        results: categories.length,
    
          categories
        
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.params.id;
      const category = await categoryService.getCategoryById(categoryId);

      res.status(STATUSCODE.OK).json({
      success :true,

          category
        
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryName, description } = req.body;
      const category = await categoryService.createCategory(categoryName, description);

      res.status(STATUSCODE.CREATED).json({
        success  : true,
          category
        
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.params.id;
      const { name, description } = req.body;
      const category = await categoryService.updateCategory(categoryId, name, description);

      res.status(STATUSCODE.OK).json({
    success : true,
   
          category
        
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.params.id;
      await categoryService.deleteCategory(categoryId);

      res.status(204).json({
        success : true,
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();