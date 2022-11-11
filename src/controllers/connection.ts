import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';
import {
  badRequestText, forbiddenDeleteText, notFoundNodeText, notFoundUserText,
} from '../utils/errorTypes';
import ConnectionModel from '../models/connection';
import { IConnectionCreate } from '../interface';
import User from '../models/user';

export const getConnections = (
  req: any,
  res: { send: (arg0: { data: any[]; }) => any; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  ConnectionModel.find(req.query.page_id ? { page_id: req.query.page_id } : {})
    .then((nodes) => res.send({ data: nodes }))
    .catch(next);
};

export const createConnection = (
  req: { user: { _id: any; };body: IConnectionCreate },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const connection = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then((user) => {
      ConnectionModel.create({
        ...connection,
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

export const deleteConnection = (
  req: { params: { id: any; }; user: { _id: string }; },
  res: {
    status: (arg0: number) => {
      (): any; new(): any;
      send: { (arg0: { message: string; }): any; new(): any; };
    };
  },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  ConnectionModel.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError(notFoundNodeText);
    })
    .then((connection) => {
      if (connection && req.user._id.toString() === connection.creator.toString()) {
        // @ts-ignore
        ConnectionModel.deleteOne(connection)
          .then(() => res.status(200).send({ message: 'connection deleted' }))
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenDeleteText);
      }
    })
    .catch(next);
};
