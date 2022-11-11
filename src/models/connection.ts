import mongoose, { Schema } from 'mongoose';
import { IConnection } from '../interface';

const connectionSchema = new Schema<IConnection>({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'node',
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'node',
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

export default mongoose.model('connection', connectionSchema);
