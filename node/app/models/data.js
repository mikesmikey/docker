import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const { Schema } = mongoose;
const DataSchema = new Schema({
  index: {
    type: Number
  },
  guid: {
    type: String
  },
  isActive: {
    type: Boolean
  },
  balance: {
    type: String
  },
  picture: {
    type: String
  },
  age: {
    type: Number
  },
  eyeColor: {
    type: String
  },
  name: {
    type: String
  },
  gender: {
    type: String
  },
  company: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  about: {
    type: String
  },
  registered: {
    type: String
  }
});
DataSchema.plugin(mongoosePaginate);
export default mongoose.model('Data',DataSchema);