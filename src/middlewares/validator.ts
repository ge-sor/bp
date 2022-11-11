import { celebrate, Joi } from 'celebrate';
import isUrlCheck from '../utils/isUrlCheck';
import { NodeTypeEnum } from '../enum';

export const authValidation = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(6),
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(100),
  }),
});

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

export const updateUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    name: Joi.string().required().min(2).max(100),
  }),
});

export const objectJoi = Joi.object().keys({
  _id: Joi.string().required().hex().length(24),
  project_id: Joi.string().required().hex().length(24),
  name: Joi.string().required(),
  description: Joi.string().allow(null),
  icon: Joi.string().allow(null).custom(isUrlCheck),
  creator: Joi.string().required().hex().length(24),
});

export const externalLink = Joi.object().keys({
    title: Joi.string().required(),
    link: Joi.string().allow(null).custom(isUrlCheck),
});

export const nodeObject = Joi.object().keys({
  page_id: Joi.string().required().hex().length(24),
  title: Joi.string().allow(null),
  subtitle: Joi.string().allow(null),

  type: Joi.string().valid(...Object.values(NodeTypeEnum)),
  coordinates: Joi.object().keys({
    x: Joi.number().required(),
    y: Joi.number().required(),
  }),
  subject: Joi.string().hex().length(24).allow(null),
  object: Joi.string().hex().length(24).allow(null),
  action: Joi.string().hex().length(24).allow(null),
  external_link: externalLink.allow(null),
});

export const nodeObjectWithId = nodeObject.keys({
  _id: Joi.string().required().hex().length(24),
});

export const page = Joi.object().keys({
  project_id: Joi.string().required().hex().length(24),
  name: Joi.string().required(),
  description: Joi.string().allow(null),
  nodes: Joi.array().items(nodeObjectWithId),
});

export const baseObject = Joi.object().keys({
  project_id: Joi.string().required().hex().length(24),
  name: Joi.string().allow(null),
  description: Joi.string().allow(null),
  icon: Joi.string().allow(null).custom(isUrlCheck),
});

export const connection = Joi.object().keys({
  from: Joi.string().required().hex().length(24),
  to: Joi.string().required().hex().length(24),
});

export const createConnectionValidation = celebrate({
  body: connection,
});

export const createObjectValidation = celebrate({
  body: baseObject,
});

export const updateObjectValidation = celebrate({
  body: objectJoi,
});

export const createNodeValidation = celebrate({
  body: nodeObject,
});

export const updateNodeValidation = celebrate({
  body: nodeObjectWithId,
});

export const createPageValidation = celebrate({
  body: page,
});

export const createProjectValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(null),
  }),
});

export const deleteByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});
