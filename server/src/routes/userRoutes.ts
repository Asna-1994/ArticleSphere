import express  from 'express';
import { protect } from '../middlewares/authMiddleware';
import { userController } from '../controllers/UserController';



const router = express.Router()

router.use(protect)
router.get('/profile' , userController.getProfile)
router.patch('/profile', userController.updateProfile)
router.patch('/preferences',protect, userController.updatePreferences)

export default router