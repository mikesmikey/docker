import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const { Schema } = mongoose;
const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,

  },
  pageCount: {
    type: Number,
  },
  publishedDate: {
    type: Date,
  },
  thumbnailUrl: {
    type:String,
  },
  status: {
    type: String,
  },
  authors: {
    type:[String],
  },
  categories: {
    type:[String],
  }
});

BookSchema.plugin(mongoosePaginate);
export default mongoose.model('Book',BookSchema);