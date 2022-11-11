import mongoose, { Schema } from 'mongoose';
import { IPage } from '../interface';
import { nodeSchema } from './node';

const pageSchema = new Schema<IPage>({
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
    required: true,
    default: null,
  },
  nodes: [nodeSchema],
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

export default mongoose.model('page', pageSchema);
