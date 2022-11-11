import { Router } from 'express';
import {createNode, deleteNode, getNodes, updateNode} from '../controllers/node';
import {createNodeValidation, deleteByIdValidation, updateNodeValidation} from '../middlewares/validator';

const nodeRoutes = Router();
// @ts-ignore
nodeRoutes.get('/', getNodes);

// @ts-ignore
nodeRoutes.post('/', createNodeValidation, createNode);

// @ts-ignore
nodeRoutes.patch('/:id', updateNodeValidation, updateNode);

// @ts-ignore
nodeRoutes.delete('/:id', deleteByIdValidation, deleteNode);

export default nodeRoutes;
