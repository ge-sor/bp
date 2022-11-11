import { Router } from 'express';
import { createUser, login } from '../controllers/user';
import { authValidation, loginValidation } from '../middlewares/validator';

const authRoutes = Router();

// @ts-ignore
authRoutes.post('/signup', authValidation, createUser);

// @ts-ignore
authRoutes.post('/signin', loginValidation, login);

export default authRoutes;
