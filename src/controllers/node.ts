import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';
import {
  badRequestText, forbiddenDeleteText, notFoundNodeText, notFoundUserText,
} from '../utils/errorTypes';
import { NodeModel } from '../models/node';
import { INode, INodeCreate, INodeMove } from '../interface';
import User from '../models/user';
import ConnectionModel from '../models/connection';

export const getNodes = (
  req: any,
  res: { send: (arg0: { data: any[]; }) => any; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  NodeModel.find(req.query.page_id ? { page_id: req.query.page_id } : {})
    .then((nodes) => res.send({ data: nodes }))
    .catch(next);
};

export const createNode = (
  req: { user: { _id: any; };body: INodeCreate },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const node = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then((user) => {
      NodeModel.create({
        ...node,
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

export const updateNode = (
  req: { params: { id: any; };user: { _id: any; };body: INode },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  console.log('update node');
  const node = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then(() => {
      NodeModel.findByIdAndUpdate(req.params.id, node, { new: true })
        .then((value) => {
          if (!value) {
            throw new BadRequestError(badRequestText);
          }
          res.send({ data: value });
        })
        .catch(next);
    }).catch(next);
};

export const deleteNode = (
  req: { params: { id: any; }; user: { _id: string }; },
  res: {
    status: (arg0: number) => {
      (): any; new(): any;
      send: { (arg0: { message: string; }): any; new(): any; };
    };
  },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  NodeModel.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError(notFoundNodeText);
    })
    .then((node) => {
      if (node && req.user._id.toString() === node.creator.toString()) {
        // @ts-ignore
        NodeModel.deleteOne(node)
          .then(() => {
            ConnectionModel.deleteMany({ from: req.params.id })
              .then((deleted) => {
                console.log(deleted);
              }).catch((err) => {
                console.log(err);
              });
            ConnectionModel.deleteMany({ to: req.params.id })
              .then((deleted) => {
                console.log(deleted);
              }).catch((err) => {
                console.log(err);
              });
            return res.status(200).send({ message: 'Node deleted' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenDeleteText);
      }
    })
    .catch(next);
};

export const moveNode = (
  req: { params: { id: any; };user: { _id: any; };body: INodeMove },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const props = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then(() => {
      NodeModel.findByIdAndUpdate(req.params.id, { coordinates: props.coordinates }, { new: true })
        .then((value) => {
          if (!value) {
            throw new BadRequestError(badRequestText);
          }
          res.send({ data: value });
        })
        .catch(next);
    }).catch(next);
};
