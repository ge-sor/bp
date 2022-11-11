import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import AuthError from '../errors/auth-err';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import ConflictError from '../errors/conflict-err';
import {
  badRequestText, conflictEmailText, notFoundUserText, wrongEmailOrPassowordText,
} from '../utils/errorTypes';

const { JWT_SECRET = 'DEFAULT_JWT_SECRET' } = process.env;

export const getUser = (
  req: { user: { _id: any; }; },
  res: { send: (arg0: { email: any; name: any;  id: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUserText);
    })
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
        id: user._id,
      });
    })
    .catch(next);
};

export const createUser = (
  req: { body: { name: any; email: any; password: any; }; },
  res: { status: (arg0: number) => { (): any; new(): any;
    send: { (arg0: { message: string; }): void; new(): any; }; }; },
  next: ((arg0: any) => any) | null | undefined,
) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email }).then((find) => {
    if (find) {
      throw new ConflictError(conflictEmailText);
    } else {
      bcrypt.hash(password, 10).then((hash) => User.create({
        name, email, password: hash,
      })
        .then(() => {
          res.status(200).send({ message: 'Вы успешно зарегистрировались' });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError(badRequestText);
          }
          if (err.code === 11000) {
            throw new ConflictError(conflictEmailText);
          }
          return next ? next(err) : err;
        })).catch(next);
    }
  }).catch(next);
};

export const updateUser = (
  req: { user: { _id: any; }; body: { name: any; email: any; }; },
  res: { send: (arg0: { email: any; name: any; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findOne({ email }).then((find) => {
    if (find) {
      throw new ConflictError(conflictEmailText);
    } else {
      User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true },
      )
        .orFail(() => {
          throw new NotFoundError(notFoundUserText);
        })
        .then((user) => {
          if (!user) {
            throw new BadRequestError(badRequestText);
          }
          res.send({
            email: user.email,
            name: user.name,
          });
        })
        .catch(next);
    }
  }).catch(next);
};

export const login = (
  req: { body: { email: any; password: any; }; },
  res: { send: (arg0: { token: string; }) => void; },
  next: ((reason: any) => PromiseLike<never>) | null | undefined,
) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new AuthError(wrongEmailOrPassowordText);
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((ok) => {
          if (!ok) {
            throw new AuthError(wrongEmailOrPassowordText);
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};
