import Todo from '../models/todo';
import Joi from 'joi';
import '../../config/passport'; // Must have fix issue : Fix Error: Unknown authentication strategy "local"

export default {
  async getTodo(req, res, next) {
    try {
      const { page, perPage } = req.query;
      const options = {
        select: '_id email roles name surname title status',
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
      };

      const todo = await Todo.paginate({}, options);
      return res.status(201).json(todo);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  },

  async createTodo(req, res, next) {

    const todoData = {
      title: req.body.title,
    };
    const schema = Joi.object().keys({
      title: Joi.string().min(1).max(255).required(),
    });
    const { value, error} = Joi.validate(todoData, schema);
    if(error) {
      res.status(500);
      return next(error);
    }
    try {

      const todo = await Todo.create({title: value.title});
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  },

  async deleteTodo(req, res, next) {
    try {
      const todo = await Todo.remove({_id: req.params.todo_id});
      return todo.json();
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
  }
}

