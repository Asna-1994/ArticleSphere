import { articleRepository } from '../repositories/ArticleRepository';
import {   CustomError } from '../middlewares/errorHandler';
import { CreateArticleDto, UpdateArticleDto } from '../dto/ArticleDto';
import  { IArticle } from '../entities/Article';
import { STATUSCODE } from '../constants/StatusCodes';
import { ErrorMessages } from '../constants/Messages';
import { deleteFromCloudinary } from '../config/cloudinaryConfig';
import mongoose from 'mongoose';


export class ArticleService {
  async createArticle(authorId: string, articleData: CreateArticleDto): Promise<IArticle> {
    return articleRepository.create({
      ...articleData,
      author: authorId
    });
  }

  async getArticleById(articleId: string): Promise<IArticle> {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new CustomError(ErrorMessages.ARTICLE_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }
    return article;
  }

  async getUserArticles(userId: string): Promise<IArticle[]> {
    return articleRepository.findByAuthor(userId);
  }

  async getArticlesByPreferences(userId: string, skip = 0, limit = 10) {
    return articleRepository.findByPreferences(userId, skip, limit);
  }
  

  async updateArticle(
    articleId: string,
    authorId: string,
    data: UpdateArticleDto & { newImageUrls?: { url: string; publicId: string }[] },
    removedImages: { publicId: string }[]
  ): Promise<IArticle> {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new Error('Article not found');
    if (article.author.toString() !== authorId.toString()) throw new Error('Unauthorized');
  

    for (const img of removedImages) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }
    
  

    article.imageUrls = article.imageUrls.filter(
      (img) => !removedImages.some((r) => r.publicId === img.publicId)
    );
  

    if (data.newImageUrls && data.newImageUrls.length > 0) {
      article.imageUrls.push(...data.newImageUrls);
    }
  

    article.title = data.title!;
    article.description = data.description!;
    article.content = data.content!;
    article.tags = data.tags || [];
    article.category = new mongoose.Types.ObjectId(data.category) 
  
    return await article.save();
  }

  async deleteArticle(articleId: string, authorId: string): Promise<void> {

    const article = await articleRepository.findById(articleId);
    
    if (!article) {
      throw new CustomError(ErrorMessages.ARTICLE_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }

    if (article.author.toString() !== authorId) {
      throw new CustomError('You are not authorized to delete this article', STATUSCODE.FORBIDDEN);
    }

    if (article.imageUrls && article.imageUrls.length > 0) {
      await Promise.all(
        article.imageUrls.map((img: { publicId: string }) =>
          deleteFromCloudinary(img.publicId)
        )
      );
    }
    const deleted = await articleRepository.delete(articleId);
    
    if (!deleted) {
      throw new CustomError('Failed to delete article', STATUSCODE.NOT_FOUND);
    }
  }



  async likeArticle(articleId: string, userId: string): Promise<IArticle> {
    const article = await articleRepository.likeArticle(articleId, userId);
    
    if (!article) {
      throw new CustomError(ErrorMessages.ARTICLE_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }

    return article;
  }

  async dislikeArticle(articleId: string, userId: string): Promise<IArticle> {
    const article = await articleRepository.dislikeArticle(articleId, userId);
    
    if (!article) {
      throw new CustomError(ErrorMessages.ARTICLE_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }

    return article;
  }

  async blockArticle(articleId: string, userId: string): Promise<IArticle> {
    const article = await articleRepository.blockArticle(articleId, userId);
    
    if (!article) {
      throw new CustomError(ErrorMessages.ARTICLE_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }

    return article;
  }
}

export const articleService = new ArticleService();