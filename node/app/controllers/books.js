import Book from '../models/book';
import Joi from 'joi';
import '../../config/passport'; // Must have fix issue : Fix Error: Unknown authentication strategy "local"

export default {
  async getBooks(req, res, next) {
    try {
      const { page, perPage } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
      };
      const books = await Book.paginate({}, options);
      return res.json(books);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  },

  async createBook(req, res, next) {

    const bookData = {
      title: req.body.title,
    };
    const schema = Joi.object().keys({
      title: Joi.string().min(1).max(255).required(),
    });
    const { value, error} = Joi.validate(bookData, schema);
    if(error) {
      res.status(500);
      return next(error);
    }
    try {

      const book = await Book.create({title: value.title});
      const books = await Book.find();
      res.json(books);
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  },

  async deleteBook(req, res, next) {
    try {
      const book = await Book.remove({_id: req.params.book_id});
      return book.json();
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
  }
}

