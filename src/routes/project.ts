import { Router } from 'express';
import { createProjectValidation, deleteByIdValidation } from '../middlewares/validator';
import { createProject, deleteProject, getProjects } from '../controllers/project';

const projectRoutes = Router();
// @ts-ignore
projectRoutes.get('/', getProjects);

// @ts-ignore
projectRoutes.post('/', createProjectValidation, createProject);

// @ts-ignore
projectRoutes.delete('/:id', deleteByIdValidation, deleteProject);

export default projectRoutes;
