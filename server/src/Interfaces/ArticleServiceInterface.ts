import { CreateArticleDto, UpdateArticleDto } from "../dto/ArticleDto";
import { IArticle } from "../entities/Article";



export interface IArticleService {
  createArticle(authorId: string, articleData: CreateArticleDto): Promise<IArticle>;
  getArticleById(articleId: string): Promise<IArticle>;
  getUserArticles(userId: string): Promise<IArticle[]>;
  getArticlesByPreferences(userId: string, skip?: number, limit?: number): Promise<{ articles: IArticle[]; total: number }>;
  updateArticle(
    articleId: string,
    authorId: string,
    data: UpdateArticleDto & { newImageUrls?: { url: string; publicId: string }[] },
    removedImages: { publicId: string }[]
  ): Promise<IArticle>;
  deleteArticle(articleId: string, authorId: string): Promise<void>;
  likeArticle(articleId: string, userId: string): Promise<IArticle>;
  dislikeArticle(articleId: string, userId: string): Promise<IArticle>;
  blockArticle(articleId: string, userId: string): Promise<IArticle>;
}
