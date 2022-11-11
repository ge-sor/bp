import { Router } from 'express';
import { createConnectionValidation, deleteByIdValidation } from '../middlewares/validator';
import { createConnection, deleteConnection, getConnections } from '../controllers/connection';

const connectionRoutes = Router();
// @ts-ignore
connectionRoutes.get('/', getConnections);

// @ts-ignore
connectionRoutes.post('/', createConnectionValidation, createConnection);

// @ts-ignore
connectionRoutes.delete('/:id', deleteByIdValidation, deleteConnection);

export default connectionRoutes;
