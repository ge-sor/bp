import { Router } from 'express';
import { createObjectValidation, deleteByIdValidation } from '../middlewares/validator';
import { createSubject, deleteSubject, getSubjects } from '../controllers/subject';

const subjectRoutes = Router();
// @ts-ignore
subjectRoutes.get('/', getSubjects);

// @ts-ignore
subjectRoutes.post('/', createObjectValidation, createSubject);

// @ts-ignore
subjectRoutes.delete('/:id', deleteByIdValidation, deleteSubject);

export default subjectRoutes;
