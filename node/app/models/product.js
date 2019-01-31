import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {roleType, defaultRoleType} from '../../config/role';
import mongoosePaginate from 'mongoose-paginate';
const { Schema } = mongoose;

const ProductSchema = new Schema({
  code: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    lowercase: true,
    required: true,
  },
  unit: {

  },
}, {
  timestamps: true,
});



ProductSchema.plugin(mongoosePaginate);
export default mongoose.model('Product', ProductSchema);