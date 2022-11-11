import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http, { IncomingMessage } from 'http';
import { Server } from 'socket.io';
import session, { Session } from 'express-session';
import jwt from 'jsonwebtoken';
import { errorLogger, requestLogger } from './src/middlewares/logger';
import router from './src/routes/index';
import baseError from './src/middlewares/baseError';
import limiter from './src/utils/rateLimit';
import { NodeModel } from './src/models/node';
import ConnectionModel from './src/models/connection';
import { IConnectionCreate, INodeMove, INodeSocketCreate } from './src/interface';
import BadRequestError from './src/errors/bad-request-err';
import { badRequestText, notFoundUserText } from './src/utils/errorTypes';
import { nodeObject } from './src/middlewares/validator';
import User from './src/models/user';
import NotFoundError from './src/errors/not-found-err';

declare module 'http' {
  interface IncomingMessage {
    cookieHolder?: string,
    session: Session & {
      page: string
    }
  }
}
dotenv.config();
const { DB_URL, PORT = 3005, SESSION_TOKEN = 'secret' } = process.env;
const app = express();
const server = http.createServer(app);
const sessionMiddleware = session({
  secret: SESSION_TOKEN,
  resave: false,
  saveUninitialized: false,
});
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://192.168.1.154:3000',
    ],
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
  },
  allowRequest: (req, callback) => {
    // with HTTP long-polling, we have access to the HTTP response here, but this is not
    // the case with WebSocket, so we provide a dummy response object
    const fakeRes = {
      getHeader() {
        return [];
      },
      setHeader(key: string, values: string[]) {
        // eslint-disable-next-line prefer-destructuring
        req.cookieHolder = values[0];
      },
      writeHead() {
      },
    };
    // @ts-ignore
    sessionMiddleware(req as unknown as Request, fakeRes as unknown as Response, () => {
      if (req.session) {
        // trigger the setHeader() above
        fakeRes.writeHead();
        // manually save the session (normally triggered by res.end())
        req.session.save();
      }
      callback(null, true);
    });
  },
});

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(DB_URL || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);
const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://192.168.1.154:3000',
];
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (origin && allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }

  next();
});
app.use(helmet());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
// @ts-ignore
app.use(baseError);
io.engine.on('initial_headers', (headers: { [key: string]: string }, req: IncomingMessage) => {
  if (req.cookieHolder) {
    // eslint-disable-next-line no-param-reassign
    headers['set-cookie'] = req.cookieHolder;
    delete req.cookieHolder;
  }
});
io.use((socket, next) => {
  const { JWT_SECRET = 'DEFAULT_JWT_SECRET' } = process.env;
  if (socket.handshake.query && socket.handshake.query.token) {
    // eslint-disable-next-line consistent-return
    jwt.verify(<string>socket.handshake.query.token, JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
})
  .on('connection', (socket) => {
    console.log('a user connected');
    const req = socket.request;

    socket.use((__, next) => {
      console.log('reload');
      req.session.reload((err) => {
        if (err) {
          socket.disconnect();
        } else {
          next();
        }
      });
    });

    socket.on('set_page', (e) => {
      console.log('set_page', e);
      req.session.page = e;
      req.session.save();
      io.emit('set_page', e);
    });

    socket.on('node_delete', (value: string) => {
      NodeModel.findByIdAndDelete(value)
        .then(() => {
          ConnectionModel.deleteMany({ from: value })
            .then((res) => {
              console.log('delete11', res);
            }).catch((err) => {
              console.log('err11', err);
            });
          ConnectionModel.deleteMany({ to: value })
            .then((res) => {
              console.log('delete12', res);
            }).catch((err) => {
              console.log('err12', err);
            });

          io.emit('node_delete', value);
        });
    });

    socket.on('link_delete', (value: string) => {
      ConnectionModel.findByIdAndDelete(value)
        .then(() => {
          io.emit('link_delete', value);
        });
    });

    socket.on('node_move', (value: string) => {
      const node: INodeMove = JSON.parse(value) as INodeMove;
      NodeModel.findByIdAndUpdate(node._id, { coordinates: node.coordinates }, { new: true })
        .then((updatedNode) => {
          if (!updatedNode) {
            throw new BadRequestError(badRequestText);
          }
          io.emit('node_move', { _id: updatedNode._id, coordinates: updatedNode.coordinates });
        });
    });

    socket.on('link_create', (value: string) => {
      const link: IConnectionCreate = JSON.parse(value) as IConnectionCreate;
      console.log(link);
      ConnectionModel.create(link)
        .then((newLink) => {
          if (!newLink) {
            throw new BadRequestError(badRequestText);
          }

          io.emit('link_create', newLink);
        });
    });

    socket.on('node_create', async (value: string) => {
      const node: INodeSocketCreate = JSON.parse(value) as INodeSocketCreate;
      try {
        User.findById(node.creator)
          .orFail(() => {
            throw new NotFoundError(notFoundUserText);
          }).then(async (user) => {
            const parsedNode = await nodeObject.validateAsync({
              page_id: node.page_id,
              type: node.type,
              coordinates: node.coordinates,
            });
            NodeModel.create({ ...parsedNode, creator: user?._id })
              .then((newNode) => {
                if (!newNode) {
                  throw new BadRequestError(badRequestText);
                }

                io.emit('node_create', newNode);
              });
          }).catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    });

    const nodeStream = NodeModel.watch();

    const connectionStream = ConnectionModel.watch();

    nodeStream.on('change', (next) => {
      switch (next.operationType) {
        case 'insert':
          console.log(next.fullDocument.message);
          break;
        case 'update':
          console.log(next.updateDescription?.updatedFields?.message);
          break;
        default: { /* empty */
        }
      }
    });

    connectionStream.on('change', (next) => {
      switch (next.operationType) {
        case 'insert':
          console.log(next.fullDocument.message);
          break;
        case 'update':
          console.log(next.updateDescription?.updatedFields?.message);
          break;
        default: { /* empty */
        }
      }
    });
  });

io.listen(3010);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App on port ${PORT}`);
});
