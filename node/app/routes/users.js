import AuthenticationController from '../controllers/authentication';
import UserController from '../controllers/users';
import express from 'express';

import passport from 'passport';
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});


const userRoutes = express.Router()
userRoutes.get('/'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UserController.getUsers);

  userRoutes.get('/:id'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UserController.getUser);  


  userRoutes.post('/'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UserController.createUser);

  userRoutes.delete('/:id'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UserController.deleteUser);  

  userRoutes.put('/'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UserController.updateUser); 
  
  userRoutes.put('/status'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UserController.setUserStatus); 


export default function(rootRoutes) {
  rootRoutes.use('/users', userRoutes);
};