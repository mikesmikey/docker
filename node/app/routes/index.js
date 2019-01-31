import AuthenticationController from '../controllers/authentication';

import TodoController from '../controllers/todos';
import BookController from '../controllers/books';
import UserRoutes from './users';
import UnitRoutes from './units';
import DataRoutes from './datas';
import express from 'express';

import passport from 'passport';

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

export default function(app) {
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router(),
        bookRoutes = express.Router();
  

  apiRoutes.use('/auth', authRoutes);

  authRoutes.post('/register', AuthenticationController.register);
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  authRoutes.get('/protected', requireAuth, function(req, res) {
    res.send({content: 'Success'});
  });

  // User Route
  UserRoutes(apiRoutes);
  DataRoutes(apiRoutes);
  UnitRoutes(apiRoutes);

  
  // Todo Route
  apiRoutes.use('/todos', todoRoutes);

  todoRoutes.get('/'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , TodoController.getTodo);

  todoRoutes.post('/'
  , requireAuth
  , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , TodoController.createTodo);

  todoRoutes.delete('/:todo_id'
  , requireAuth
  , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , TodoController.deleteTodo);

  apiRoutes.use('/books', bookRoutes);

  bookRoutes.get('/'
    , requireAuth
    ,AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
    ,BookController.getBooks);

  // Set up route
  app.use('/', apiRoutes)
}
