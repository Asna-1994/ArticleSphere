import express  from 'express';
import { protect } from '../middlewares/authMiddleware';
import { articleController } from '../controllers/ArticleController';
import { upload } from '../config/cloudinaryConfig';



const router = express.Router()

router.get('/:article-id', articleController.getArticle)


router.use(protect)

router.get('/', articleController.getFeedArticles)
router.post('/',upload.array('images',5), articleController.createArticle)
router.patch('/:articleId',upload.array('images',5), articleController.updateArticle)
router.get('/user', articleController.getUserArticles);
router.delete('/:articleId', articleController.deleteArticle)
router.post('/:articleId/like', articleController.likeArticle)
router.post('/:articleId/dislike', articleController.dislikeArticle)
router.post('/:articleId/block', articleController.blockArticle)


export default router