import jwt from 'jsonwebtoken';
import User from '../models/user';
import authConfig from '../../config/auth';
import Joi from 'joi';
import {roleType, defaultRoleType} from '../../config/role';
import '../../config/passport'; // Must have fix issue : Fix Error: Unknown authentication strategy "local"

const generateToken = function(user) {
  return jwt.sign(user, authConfig.secret, {
    expiresIn: 10080,
  })
}

const setUserInfo = function(request) {
  return {
    _id: request._id,
    email: request.email,
    roles: request.roles,
    name: request.name,
    surname: request.surname,
    title: request.title,
    status: request.status,
  };
}

const checkAuthen = async function(req, res, next) {
  const user = req.user;
  console.log('checkAuthen',roles)
  try {
    const authenUser = await User.findById(user._id);

    return authenUser.roles.forEach(role => {
      if(roles.indexOf(role)> -1) {
        return next();
      }
      res.status(401).json({error: 'You are not authorized to view this content'});
      return next('Unauthorized');
    });
    

  } catch (error) {
    res.status(422).json({error: 'No user found'});
  }
  
};
export default {
  login(req, res, next) { 
    const userInfo = setUserInfo(req.user);
    res.status(200).json({
      token: 'JWT ' +  generateToken(userInfo),
      user: userInfo,
    });
  },

  async register(req, res, next) {
    
    const userData = {
      email: req.body.email,
      password: req.body.password,
      roles: req.body.roles===undefined?[defaultRoleType]:Array.isArray(req.body.roles)?req.body.roles:[req.body.roles],
      name: req.body.name,
      surname: req.body.surname,
      title: req.body.title,
      status: true,
    };
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(64).required(),
      roles: Joi.array().items(Joi.string()),
      title: Joi.string().required(),
      name: Joi.string().required(),
      surname: Joi.string().required(),
      status: Joi.boolean().required(),
    });
    

    const { value, error } = Joi.validate(userData, schema);
    if(error) {
      return next(error);
    }
    
    try {
      const existUser = await User.findOne({email: value.email});
      if(existUser) {
        return res.status(422).send({error: 'That email address is already in use'});
      }
      
      const newUser = new User(value);
      const user = await newUser.save();
      const userInfo =setUserInfo(user);
      res.status(201).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
      })

    } catch (err) {
      return next(err);
    }
    
  },

  roleAuthorization(authRoles) {
    return async function(req, res, next) {
      const user = req.user;

      try {
        const authenUser = await User.findById(user._id);
        console.log(authenUser.roles);
        console.log(authRoles);
        for(let i=0;i<authenUser.roles.length;i++) {
          const role =authenUser.roles[i];
          if(authRoles.indexOf(role)> -1) {
            return next();
          }
        }
        res.status(401).json({error: 'You are not authorized to view this content'});
        return next('Unauthorized');

        
      } catch (error) {
        res.status(422).json({error: 'No user found'});
      }
      
    };
  },
  generateToken: generateToken
}


