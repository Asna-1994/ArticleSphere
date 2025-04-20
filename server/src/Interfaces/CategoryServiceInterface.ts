
import { ICategory } from '../entities/Categories';


export interface ICategoryService {
getAllCategories(): Promise<ICategory[]>
getCategoryById(categoryId: string): Promise<ICategory>
createCategory(categoryName: string, description: string): Promise<ICategory> 
updateCategory(categoryId: string, name: string, description: string): Promise<ICategory> 
deleteCategory(categoryId: string): Promise<void> 

}