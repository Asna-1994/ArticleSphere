import { Request, Response, NextFunction } from 'express';
import { articleService } from '../services/ArticleService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { STATUSCODE } from '../constants/StatusCodes';
import { uploadToCloudinary } from '../config/cloudinaryConfig';

export class ArticleController {
  async createArticle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, content, tags, category} = req.body
      const files = req.files as Express.Multer.File[] | undefined
      const authorId  = req.user._id
      let imageUrls: { url: string; publicId: string }[] = [];
      if (files && files.length > 0) {
        const uploads = await Promise.all(
          files.map((file: any) => uploadToCloudinary(file.path, 'articles'))
        );
        imageUrls = uploads; 
      }
         const article = await articleService.createArticle(authorId, {
          title,
          description,
          content,
          category,
          tags: tags ? JSON.parse(tags) : [],
          imageUrls
         });

      res.status(STATUSCODE.CREATED).json({
       success : true,
        article
      });
    } catch (error) {
      next(error);
    }
  }

  async getArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const articleId = req.params.id;
      const article = await articleService.getArticleById(articleId);

      res.status(STATUSCODE.OK).json({
      success  :true,
       article
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserArticles(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const articles = await articleService.getUserArticles(req.user._id);

      res.status(STATUSCODE.OK).json({
        success : true,
        results: articles.length,
        articles
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeedArticles(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      const skip = (Number(page) - 1) * Number(limit);
  
      const { articles, total } = await articleService.getArticlesByPreferences(
        req.user._id,
        skip,
        Number(limit)
      );
  
      res.status(STATUSCODE.OK).json({
        success: true,
        results: articles.length,
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        articles
      });
    } catch (error) {
      next(error);
    }
  }
  


  async updateArticle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body)
      const { title, description, content, tags, category } = req.body;
      const files = req.files as Express.Multer.File[] | undefined;
      const articleId = req.params.articleId;
      const authorId = req.user._id;

      let newImageUrls: { url: string; publicId: string }[] = [];
      if (files && files.length > 0) {
        const uploads = await Promise.all(
          files.map((file: any) => uploadToCloudinary(file.path, 'articles'))
        );
        newImageUrls = uploads;
      }
  
      const removedImages = req.body.removedImages
        ? JSON.parse(req.body.removedImages)
        : [];
  
      const updatedArticle = await articleService.updateArticle(
        articleId,
        authorId,
        {
          title,
          description,
          content,
          category,
          tags: tags ? JSON.parse(tags) : [],
          newImageUrls,
        },
        removedImages 
      );
  
      res.status(STATUSCODE.OK).json({ success: true, article: updatedArticle });
    } catch (error) {
      next(error);
    }
  }
  

  async deleteArticle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const articleId = req.params.articleId;
      await articleService.deleteArticle(articleId, req.user._id);

      res.status(204).json({
        success : true,
        message : 'deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async likeArticle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const articleId = req.params.articleId;
      const article = await articleService.likeArticle(articleId, req.user._id);

      res.status(STATUSCODE.OK).json({
        success:true,
    
          article
        
      });
    } catch (error) {
      next(error);
    }
  }

  async dislikeArticle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const articleId = req.params.articleId;
      const article = await articleService.dislikeArticle(articleId, req.user._id);

      res.status(STATUSCODE.OK).json({
       success : true,
  
          article
        
      });
    } catch (error) {
      next(error);
    }
  }

  async blockArticle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const articleId = req.params.articleId;
      const article = await articleService.blockArticle(articleId, req.user._id);

      res.status(STATUSCODE.OK).json({
       success : true,

          article
        
      });
    } catch (error) {
      next(error);
    }
  }
}

export const articleController = new ArticleController();