import mongoose, { Schema } from 'mongoose';

const MacbooksSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  macbooks: {
    type: String,
    required: true,
    unique: false
  }
});

export const Macbooks = mongoose.model('macbooks', MacbooksSchema);
