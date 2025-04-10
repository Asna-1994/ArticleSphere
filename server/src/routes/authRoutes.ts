import express  from 'express';
import { authController } from '../controllers/AuthController';
import { protect } from '../middlewares/authMiddleware';
import { changePasswordValidator, loginValidator, registerValidator } from '../validators/authValidator';
import { validateRequest } from '../middlewares/validationMiddleware';



const router = express.Router()

router.post('/register' , registerValidator,validateRequest, authController.register)
router.post('/login',loginValidator,validateRequest, authController.login)
router.post('/logout', authController.logout)
router.post('/refresh', authController.refreshTokenController)
router.patch('/change-password',protect,changePasswordValidator,validateRequest, authController.changePassword)

export default router