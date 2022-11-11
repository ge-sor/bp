import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { ISubject } from '../interface';
import isURL = validator.isURL;

export const subjectSchema = new Schema<ISubject>({
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

export const SubjectModel = mongoose.model('subject', subjectSchema);
