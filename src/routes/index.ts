import { Router } from 'express';
import userRoutes from './user';

import authRoutes from './auth';
import NotFoundError from '../errors/not-found-err';
import { notFoundText } from '../utils/errorTypes';

import auth from '../middlewares/auth';
import nodeRoutes from './node';
import actionRoutes from './action';
import connectionRoutes from './connection';
import objectRoutes from './object';
import pageRoutes from './page';
import projectRoutes from './project';
import subjectRoutes from './subject';

const router = Router();

router.use('/', authRoutes);

// @ts-ignore
router.use('/actions', auth, actionRoutes);
// @ts-ignore
router.use('/connections', auth, connectionRoutes);
// @ts-ignore
router.use('/nodes', auth, nodeRoutes);
// @ts-ignore
router.use('/objects', auth, objectRoutes);
// @ts-ignore
router.use('/pages', auth, pageRoutes);
// @ts-ignore
router.use('/projects', auth, projectRoutes);
// @ts-ignore
router.use('/subjects', auth, subjectRoutes);
// @ts-ignore
router.use('/users', auth, userRoutes);

router.use('*', (req: any, res: any, next: (arg0: any) => void) => {
  next(new NotFoundError(notFoundText));
});

export default router;
