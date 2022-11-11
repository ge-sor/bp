import { Router } from 'express';
import { createPageValidation, deleteByIdValidation } from '../middlewares/validator';
import { createPage, deletePage, getPages } from '../controllers/page';

const pageRoutes = Router();
// @ts-ignore
pageRoutes.get('/', getPages);

// @ts-ignore
pageRoutes.post('/', createPageValidation, createPage);

// @ts-ignore
pageRoutes.delete('/:id', deleteByIdValidation, deletePage);

export default pageRoutes;
