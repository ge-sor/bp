import validator from 'validator';
import { wrongURLText } from './errorTypes';

const isUrlCheck = (value: string) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error(wrongURLText);
};

export default isUrlCheck;
