import mongoose, { Schema } from 'mongoose';
import { IProject } from '../interface';

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: null,
  },
  creator: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
});

export default mongoose.model('project', projectSchema);
