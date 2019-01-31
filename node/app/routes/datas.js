import AuthenticationController from '../controllers/authentication';
import DataController from '../controllers/datas';
import express from 'express';

import passport from 'passport';
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});


const dataRoutes = express.Router()
dataRoutes.get('/'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , DataController.getDatas);

  dataRoutes.get('/:data_id'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , DataController.getData);  


  // dataRoutes.post('/'
  // // , requireAuth
  // // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  // , DataController.createData);

  // dataRoutes.delete('/:data_id'
  // // , requireAuth
  // // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  // , DataController.deleteData);  

  // dataRoutes.put('/'
  // // , requireAuth
  // // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  // , DataController.updateData); 
  
  // dataRoutes.put('/status'
  // // , requireAuth
  // // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  // , DataController.setDataStatus); 


export default function(rootRoutes) {
  rootRoutes.use('/datas', dataRoutes);
};