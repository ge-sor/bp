import { serverErrorText } from '../utils/errorTypes';

const baseError = (
  err: { statusCode?: 500 | undefined; message: any; },
  req: any,
  res: { status: (arg0: any) => { (): any; new(): any;
    send: { (arg0: { message: any; }): void; new(): any; }; }; },
  next: () => void,
) => {
  const { statusCode = 500, message } = err;
  console.log(message);
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverErrorText
        : message,
    });
  next();
};
export default baseError;
