import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';
import {
  badRequestText, forbiddenDeleteText, notFoundNodeText, notFoundUserText,
} from '../utils/errorTypes';
import { ObjectModel } from '../models/object';
import { IActionCreate, IObject } from '../interface';
import User from '../models/user';

export const getObjects = (
  req: any,
  res: { send: (arg0: { data: any[]; }) => any; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  ObjectModel.find(req.query.project_id ? { project_id: req.query.project_id } : {})
    .then((nodes) => res.send({ data: nodes }))
    .catch(next);
};

export const createObject = (
  req: { user: { _id: any; };body: IActionCreate },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const object = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then((user) => {
      ObjectModel.create({
        ...object,
        creator: user?._id,
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

export const deleteObject = (
  req: { params: { id: any; }; user: { _id: string }; },
  res: {
    status: (arg0: number) => {
      (): any; new(): any;
      send: { (arg0: { message: string; }): any; new(): any; };
    };
  },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  ObjectModel.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError(notFoundNodeText);
    })
    .then((obj) => {
      if (obj && req.user._id.toString() === obj.creator.toString()) {
        // @ts-ignore
        ObjectModel.deleteOne(obj)
          .then(() => res.status(200).send({ message: 'obj deleted' }))
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenDeleteText);
      }
    })
    .catch(next);
};

export const updateObject = (
  req: { params: { id: any; }; user: { _id: string }; body: IObject },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const Object = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then(() => {
      // @ts-ignore
      ObjectModel.findByIdAndUpdate(req.params.id, Object, { new: true })
        .then((value) => {
          if (!value) {
            throw new BadRequestError(badRequestText);
          }
          res.send({ data: value });
        })
        .catch(next);
    })
    .catch(next);
};
