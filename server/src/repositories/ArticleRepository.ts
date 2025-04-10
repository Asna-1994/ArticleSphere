import { BaseRepository } from './BaseRepository';
import Article, { IArticle } from '../entities/Article';
import mongoose from 'mongoose';
import User from '../entities/User';

export interface IArticleRepository extends BaseRepository<IArticle> {
  findByAuthor(authorId: string): Promise<IArticle[]>;
  findByCategory(categoryId: string): Promise<IArticle[]>;
  findByPreferences(userId : string, skip : number, limit  : number): Promise<{articles: IArticle[]; total: number}>;
  likeArticle(articleId: string, userId: string): Promise<IArticle | null>;
  dislikeArticle(articleId: string, userId: string): Promise<IArticle | null>;
  blockArticle(articleId: string, userId: string): Promise<IArticle | null>;
}

export class ArticleRepository extends BaseRepository<IArticle> implements IArticleRepository {
  constructor() {
    super(Article);
  }

  async findByAuthor(authorId: string): Promise<IArticle[]> {
    return Article.find({ author: authorId })
      .populate('category', 'categoryName')
      .populate('likes' , 'firstName lastName')
      .populate('dislikes' , 'firstName lastName')
      .populate('blocks' ,'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCategory(categoryId: string): Promise<IArticle[]> {
    return Article.find({ category: categoryId })
      .populate('author', 'firstName lastName')
      .populate('likes' , 'firstName lastName')
      .populate('dislikes' , 'firstName lastName')
      .populate('blocks' ,'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPreferences(userId: string, skip = 0, limit = 10): Promise<{ articles: IArticle[]; total: number }> {
    const user = await User.findById(userId).select('preferences');
  
    if (!user || !user.preferences || user.preferences.length === 0) {
      return { articles: [], total: 0 };
    }
  
    const filter = {
      category: { $in: user.preferences },
      blocks: { $ne: new mongoose.Types.ObjectId(userId) }
    };
  
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('author', 'firstName lastName')
        .populate('category', 'categoryName')
        .populate('likes', 'firstName lastName')
        .populate('dislikes', 'firstName lastName')
        .populate('blocks', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Article.countDocuments(filter)
    ]);
  
    return { articles, total };
  }

  
  
  

  async likeArticle(articleId: string, userId: string): Promise<IArticle | null> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    return Article.findByIdAndUpdate(
      articleId,
      {
        $addToSet: { likes: userObjectId },
        $pull: { dislikes: userObjectId }
      },
      { new: true }
    ).exec();
  }

  async dislikeArticle(articleId: string, userId: string): Promise<IArticle | null> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    return Article.findByIdAndUpdate(
      articleId,
      {
        $addToSet: { dislikes: userObjectId },
        $pull: { likes: userObjectId }
      },
      { new: true }
    ).exec();
  }

  async blockArticle(articleId: string, userId: string): Promise<IArticle | null> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    return Article.findByIdAndUpdate(
      articleId,
      {
        $addToSet: { blocks: userObjectId }
      },
      { new: true }
    ).exec();
  }
}

export const articleRepository = new ArticleRepository();