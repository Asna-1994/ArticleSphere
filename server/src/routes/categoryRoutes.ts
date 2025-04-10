import express  from 'express';
import { protect } from '../middlewares/authMiddleware';
import { categoryController } from '../controllers/CategoryController';



const router = express.Router()

router.get('/', categoryController.getAllCategories)
router.get('/:category-id', categoryController.getCategory)
router.post('/', categoryController.createCategory);

router.use(protect)

router.patch('/:category-id', categoryController.updateCategory);
router.delete('/:category-id', categoryController.deleteCategory);


export default router