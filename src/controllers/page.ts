import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';
import {
  badRequestText, forbiddenDeleteText, notFoundNodeText, notFoundUserText,
} from '../utils/errorTypes';
import PageModel from '../models/page';
import { IPageCreate } from '../interface';
import User from '../models/user';

export const getPages = (
  req: any,
  res: { send: (arg0: { data: any[]; }) => any; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  PageModel.find({})
    .then((pages) => res.send({ data: pages }))
    .catch(next);
};

export const createPage = (
  req: { user: { _id: any; };body: IPageCreate },
  res: { send: (arg0: { data: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const page = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then((user) => {
      PageModel.create({
        ...page,
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

export const deletePage = (
  req: { params: { id: any; }; user: { _id: string }; },
  res: {
    status: (arg0: number) => {
      (): any; new(): any;
      send: { (arg0: { message: string; }): any; new(): any; };
    };
  },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  PageModel.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError(notFoundNodeText);
    })
    .then((page) => {
      if (page && req.user._id.toString() === page.creator.toString()) {
        // @ts-ignore
        PageModel.deleteOne(page)
          .then(() => res.status(200).send({ message: 'page deleted' }))
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenDeleteText);
      }
    })
    .catch(next);
};
