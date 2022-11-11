import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { IAction } from '../interface';
import isURL = validator.isURL;

export const actionSchema = new Schema<IAction>({
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
});

export const ActionModel = mongoose.model('action', actionSchema);
