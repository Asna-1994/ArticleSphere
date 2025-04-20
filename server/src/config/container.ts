


import { CategoryRepository } from '../repositories/CategoryRepoImpl';
import { UserRepository } from "../repositories/UserRepoImpl";
import { AuthServiceImpl } from "../services/AuthServiceImpl";
import { CategoryService } from '../services/CategoryServiceImpl';
import { UserService } from '../services/UserServieImpl';
import { ArticleService } from '../services/ArticleServiceImpl';
import { ArticleRepository } from '../repositories/ArticleRepoImpl';


export const userRepository = new UserRepository();
export const authService = new AuthServiceImpl(userRepository);


export const categoryRepository = new CategoryRepository()
export const categoryService = new CategoryService(categoryRepository)


export const userService =  new UserService(userRepository)

export const articleRepository = new ArticleRepository()
export const articleService = new ArticleService(articleRepository)