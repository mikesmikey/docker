import User, {UserSchema} from '../models/user';
import mongoose from 'mongoose';
import Joi from 'joi';
import '../../config/passport'; // Must have fix issue : Fix Error: Unknown authentication strategy "local"
import {generateToken} from './authentication';
import {roleType, defaultRoleType} from '../../config/role';
import {sleep} from '../utils/func'
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
function extract(query) {
  let operator="";
  let operant="";
  for(let i=0;i<query.length;i++) {
    if(query[i]>='0' && query[i]<='9' ) {
      operant=operant+query[i];
    } else {
      operator=operator+query[i];
    }
  }
  return {operant, operator}
}
function getMongoNumberOperator(operator) {
  switch(operator) {
    case '>' :
      return '$gt';
    case '>=' :
      return '$gte';
    case '<' :
      return '$lt';
    case '<=' :
      return '$lte';
    case '' :
      return '$eq'
    case '<>' :
      return '$ne'
    case '!=' :
      return '$ne'      
  }
}
export default {
  
  async getUsers(req, res, next) {
    
    try {
      const { page, perPage, select, order, orderBy, keyword, searchString } = req.query;
      const tmpOrder = {};
      tmpOrder[orderBy] = order;
      const options = {
        select: select,
        sort: tmpOrder,
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
      };
      // await sleep(2000);
      let filter = {};
      if(UserSchema.path(keyword) instanceof mongoose.Schema.Types.String) {
        filter={[keyword]: {'$regex': searchString, '$options' : 'i'}}
      } else if(UserSchema.path(keyword) instanceof mongoose.Schema.Types.Number) {
        let prepareString = searchString.replace(/ /g,'')
        const {operant, operator} = extract(prepareString);
        console.log({operant, operator});
        const moperator = getMongoNumberOperator(operator);
        filter={[keyword]: {[moperator]: parseFloat(operant)}}
        console.log(filter);
        // filter={[keyword]: searchString}
      }
      // await sleep(2000);
      const users = await User.paginate(filter, options);
      return res.status(201).json(users);

    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
    
  
  },
  async getUser(req, res, next) {
    try {
      console.log(req.params.id);
      // await sleep(2000);
      const user = await User.findById(req.params.id).select('_id email roles name surname title status');
      
      console.log(user);
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
    
  },
  async createUser(req, res, next) {
    console.dir(req.body);
       
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
      return res.status(201).json({
              user: userInfo
      });

    } catch (err) {
      return next(err);
    }
  },
  async updateUser(req, res, next) {
    const userData = {
      _id: req.body._id,
      email: req.body.email,
      roles: req.body.roles===undefined?[defaultRoleType]:Array.isArray(req.body.roles)?req.body.roles:[req.body.roles],
      name: req.body.name,
      surname: req.body.surname,
      title: req.body.title,
      status: req.body.status,
    };
    const schema = Joi.object().keys({
      _id: Joi.string().required(),
      email: Joi.string().email().required(),
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
      const existUser = await User.findOne({_id: userData._id});
      
      existUser.email = userData.email;
      existUser.roles = userData.roles;
      existUser.name = userData.name;
      existUser.surname = userData.surname;
      existUser.title = userData.title;
      existUser.status = userData.status;
      
      const user = await existUser.save();
      const userInfo =setUserInfo(user);
      res.status(201).json({
        user: userInfo
      })

    } catch (err) {
      return next(err);
    }
  },
  async deleteUser(req, res, next) {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
  },
  async setUserStatus(req, res, next) {
    const userData = {
      _id: req.body._id,
      status: req.body.status==='true',
    };
    const schema = Joi.object().keys({
      _id: Joi.string().required(),
      status: Joi.boolean().required(),
    });
    

    const { value, error } = Joi.validate(userData, schema);
    if(error) {
      return next(error);
    }
    
    try {
      const existUser = await User.findOne({_id: userData._id});   
      existUser.status = userData.status;
      
      const user = await existUser.save();
      const userInfo =setUserInfo(user);
      res.status(201).json({
        user: userInfo
      })

    } catch (err) {
      return next(err);
    }
  },
}

