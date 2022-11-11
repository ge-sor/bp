import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';
import {badRequestText, forbiddenDeleteText, notFoundNodeText, notFoundUserText} from '../utils/errorTypes';
import ProjectModel from '../models/project';
import { IProjectCreate } from '../interface';
import {Schema} from "mongoose";
import User from "../models/user";

export const getProjects = (
  req: any,
  res: { send: (arg0: { data: any[]; }) => any; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  ProjectModel.find({})
    .then((projects) => res.send({ data: projects }))
    .catch(next);
};

export const createProject = (
  req: { user: { _id: any; };body: IProjectCreate },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const project = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then((user) => {
      ProjectModel.create({
        ...project,
        creator: {
          id: user?._id,
          name: user?.name,
        },
      })
        .then((value) => {
          if (!value) {
            throw new BadRequestError(badRequestText);
          }
          res.send({ data: value });
        })
        .catch(next);
    }).catch(next);
};

export const deleteProject = (
  req: { params: { id: any; }; user: { _id: string }; },
  res: {
    status: (arg0: number) => {
      (): any; new(): any;
      send: { (arg0: { message: string; }): any; new(): any; };
    };
  },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  ProjectModel.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError(notFoundNodeText);
    })
    .then((project) => {
      if (project && req.user._id.toString() === project.creator.toString()) {
        // @ts-ignore
        ProjectModel.deleteOne(project)
          .then(() => res.status(200).send({ message: 'Project deleted' }))
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenDeleteText);
      }
    })
    .catch(next);
};
