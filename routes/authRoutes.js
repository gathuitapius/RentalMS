import express from 'express';
import { login, register, generateTestToken } from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../middlewares/validate.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/generateToken', generateTestToken);

export default router;