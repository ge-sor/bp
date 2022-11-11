import { Router } from 'express';
import { createObjectValidation, deleteByIdValidation } from '../middlewares/validator';
import { createAction, deleteAction, getActions } from '../controllers/action';

const actionRoutes = Router();
// @ts-ignore
actionRoutes.get('/', getActions);

// @ts-ignore
actionRoutes.post('/', createObjectValidation, createAction);

// @ts-ignore
actionRoutes.delete('/:id', deleteByIdValidation, deleteAction);

export default actionRoutes;
