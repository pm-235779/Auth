import express from 'express';
import { signup, login, logout, verifyEmail , forgotPassword , resetPassword,checkAuth} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/VerifyToken.js';
const router = express.Router();

router.get('/check-Auth', verifyToken, checkAuth);

router.post('/signup', signup);

router.post('/verify-email', verifyEmail);

router.post('/login', login);

router.post('/logout', logout);

router.post('/reset-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

export default router;