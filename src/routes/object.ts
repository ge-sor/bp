import { Router } from 'express';
import {createObjectValidation, deleteByIdValidation, updateObjectValidation} from '../middlewares/validator';
import { createObject, getObjects, deleteObject, updateObject } from '../controllers/object';

const objectRoutes = Router();
// @ts-ignore
objectRoutes.get('/', getObjects);

// @ts-ignore
objectRoutes.post('/', createObjectValidation, createObject);

// @ts-ignore
objectRoutes.patch('/:id', updateObjectValidation, updateObject);

// @ts-ignore
objectRoutes.delete('/:id', deleteByIdValidation, deleteObject);

export default objectRoutes;
