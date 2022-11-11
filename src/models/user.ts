import mongoose from 'mongoose';
import validator from 'validator';
import { wrongEmailText } from '../utils/errorTypes';
import isEmail = validator.isEmail;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => isEmail(value),
      message: wrongEmailText,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

export default mongoose.model('user', userSchema);
