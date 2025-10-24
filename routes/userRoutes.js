import express from 'express';
import { getUsers, getTime } from '../controllers/userController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getTime);
router.get('/users', authenticateToken, getUsers);

export default router;