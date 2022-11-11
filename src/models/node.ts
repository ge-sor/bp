import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { IExternalLink, INode } from '../interface';
import { NodeTypeEnum } from '../enum';
import isURL = validator.isURL;

export const externalLinkSchema = new Schema<IExternalLink>({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => (value ? isURL(value) : true),
    },
  },
});

export const nodeSchema = new Schema<INode>({
  page_id: {
    type: Schema.Types.ObjectId,
    refs: 'page',
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
  subtitle: {
    type: String,
    default: null,
  },
  type: {
    type: Number,
    required: true,
    enum: NodeTypeEnum,
  },
  coordinates: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'subject',
    default: null,
  },
  object: {
    type: Schema.Types.ObjectId,
    ref: 'object',
    default: null,
  },
  action: {
    type: Schema.Types.ObjectId,
    ref: 'action',
    default: null,
  },
  external_link: {
    type: externalLinkSchema,
    default: null,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

export const NodeModel = mongoose.model('node', nodeSchema);
