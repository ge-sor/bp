import { Router } from 'express';
import { getUser, updateUser } from '../controllers/user';
import { updateUserValidation } from '../middlewares/validator';

const userRoutes = Router();

// @ts-ignore
userRoutes.get('/me', getUser);

// @ts-ignore
userRoutes.patch('/me', updateUserValidation, updateUser);

export default userRoutes;
