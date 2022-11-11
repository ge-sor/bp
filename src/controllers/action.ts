import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';
import {
  badRequestText, forbiddenDeleteText, notFoundNodeText, notFoundUserText,
} from '../utils/errorTypes';
import { ActionModel } from '../models/action';
import { IActionCreate } from '../interface';
import User from '../models/user';

export const getActions = (
  req: any,
  res: { send: (arg0: { data: any[]; }) => any; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  ActionModel.find(req.query.project_id ? { project_id: req.query.project_id } : {})
    .then((nodes) => res.send({ data: nodes }))
    .catch(next);
};

export const createAction = (
  req: { user: { _id: any; };body: IActionCreate },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const action = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then((user) => {
      ActionModel.create({
        ...action,
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

export const deleteAction = (
  req: { params: { actionId: any; }; user: { _id: string }; },
  res: {
    status: (arg0: number) => {
      (): any; new(): any;
      send: { (arg0: { message: string; }): any; new(): any; };
    };
  },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  ActionModel.findById(req.params.actionId)
    .orFail(() => {
      throw new NotFoundError(notFoundNodeText);
    })
    .then((action) => {
      if (action && req.user._id.toString() === action.creator.toString()) {
        // @ts-ignore
        ActionModel.deleteOne(action)
          .then(() => res.status(200).send({ message: 'Action deleted' }))
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenDeleteText);
      }
    })
    .catch(next);
};
