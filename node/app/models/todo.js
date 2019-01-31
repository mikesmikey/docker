import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const { Schema } = mongoose;
const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
},{
  timestamps:true,
});
TodoSchema.plugin(mongoosePaginate);
export default mongoose.model('Todo',TodoSchema);