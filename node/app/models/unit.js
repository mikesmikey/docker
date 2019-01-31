import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {roleType, defaultRoleType} from '../../config/role';
import mongoosePaginate from 'mongoose-paginate';
const { Schema } = mongoose;

export const UnitSchema = new Schema({
  code: {
    type: String,
    uppercase: true,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

UnitSchema.plugin(mongoosePaginate);
export default mongoose.model('Unit', UnitSchema);