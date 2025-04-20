import { IArticle } from "../entities/Article";
import { BaseRepository } from "../repositories/BaseRepoImpl";





export interface IArticleRepository extends BaseRepository<IArticle> {
  findByAuthor(authorId: string): Promise<IArticle[]>;
  findByCategory(categoryId: string): Promise<IArticle[]>;
  findByPreferences(userId : string, skip : number, limit  : number): Promise<{articles: IArticle[]; total: number}>;
  likeArticle(articleId: string, userId: string): Promise<IArticle | null>;
  dislikeArticle(articleId: string, userId: string): Promise<IArticle | null>;
  blockArticle(articleId: string, userId: string): Promise<IArticle | null>;
}