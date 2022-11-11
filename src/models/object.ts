import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { IObject } from '../interface';
import isURL = validator.isURL;

export const objectSchema = new Schema<IObject>({
  project_id: {
    type: Schema.Types.ObjectId,
    ref: 'project',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  icon: {
    type: Schema.Types.Mixed,
    default: null,
    validate: {
      validator: (value: string | null) => (value ? isURL(value) : true),
    },
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

export const ObjectModel = mongoose.model('object', objectSchema);
