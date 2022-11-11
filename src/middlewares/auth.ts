import jwt from 'jsonwebtoken';
import AuthError from '../errors/auth-err';
import { authErrorText } from '../utils/errorTypes';

const { JWT_SECRET = 'DEFAULT_JWT_SECRET' } = process.env;
export default (
  req: { headers: { authorization: any; }; user: string | jwt.JwtPayload; },
  res: any,
  next: () => void,
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new AuthError(authErrorText);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError(authErrorText);
  }
  req.user = payload;
  next();
};
