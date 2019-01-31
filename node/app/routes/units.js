import AuthenticationController from '../controllers/authentication';
import UnitController from '../controllers/units';
import express from 'express';

import passport from 'passport';
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});


const unitRoutes = express.Router()
unitRoutes.get('/'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UnitController.getUnits);

  unitRoutes.get('/:id'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UnitController.getUnit);  


  unitRoutes.post('/'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UnitController.createUnit);

  unitRoutes.delete('/:id'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UnitController.deleteUnit);  

  unitRoutes.put('/'
  // , requireAuth
  // , AuthenticationController.roleAuthorization(['admin', 'owner', 'officer', 'sell', 'stock', 'customer'])
  , UnitController.updateUnit); 
  



export default function(rootRoutes) {
  rootRoutes.use('/units', unitRoutes);
};