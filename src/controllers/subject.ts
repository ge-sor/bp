import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';
import {
  badRequestText, forbiddenDeleteText, notFoundNodeText, notFoundUserText,
} from '../utils/errorTypes';
import { SubjectModel } from '../models/subject';
import { IActionCreate } from '../interface';
import User from '../models/user';

export const getSubjects = (
  req: any,
  res: { send: (arg0: { data: any[]; }) => any; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  SubjectModel.find(req.query.project_id ? { project_id: req.query.project_id } : {})
    .then((subjects) => res.send({ data: subjects }))
    .catch(next);
};

export const createSubject = (
  req: { user: { _id: any; };body: IActionCreate },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const subject = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then((user) => {
      SubjectModel.create({
        ...subject,
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

export const deleteSubject = (
  req: { params: { nodeId: any; }; user: { _id: string }; },
  res: {
    status: (arg0: number) => {
      (): any; new(): any;
      send: { (arg0: { message: string; }): any; new(): any; };
    };
  },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  SubjectModel.findById(req.params.nodeId)
    .orFail(() => {
      throw new NotFoundError(notFoundNodeText);
    })
    .then((subject) => {
      if (subject && req.user._id.toString() === subject.creator.toString()) {
        // @ts-ignore
        SubjectModel.deleteOne(subject)
          .then(() => res.status(200).send({ message: 'subject deleted' }))
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenDeleteText);
      }
    })
    .catch(next);
};
