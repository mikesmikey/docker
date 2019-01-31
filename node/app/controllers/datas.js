import Data from '../models/data';
import Joi from 'joi';
import {sleep} from '../utils/func';
import '../../config/passport'; // Must have fix issue : Fix Error: Unknown authentication strategy "local"
// const setDataInfo = function(request) {
//   return {
//     _id: request._id,
//     email: request.email,
//     roles: request.roles,
//     name: request.name,
//     surname: request.surname,
//     title: request.title,
//     status: request.status,
//   };
// }
export default {
  
  async getDatas(req, res, next) {
    
    try {  
      const { page, perPage, select, order, orderBy } = req.query;
      const tmpOrder = {};
      tmpOrder[orderBy] = order;
      const options = {
        select: select,
        sort: tmpOrder,
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
      };
      
      const datas = await Data.paginate({}, options);
      // await sleep(2000);
      return res.status(201).json(datas);

    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
    
  
  },
  async getData(req, res, next) {
    try {
      console.log(req.params.data_id);
      const data = await Data.findById(req.params.data_id)
                          .select('_id index guid isActive balance picture age eyeColor name gender company email phone address about registered');
      res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
    
  },
  // async createData(req, res, next) {

       
  //   const dataData = {
  //     email: req.body.email,
  //     password: req.body.password,
  //     roles: req.body.roles===undefined?[defaultRoleType]:Array.isArray(req.body.roles)?req.body.roles:[req.body.roles],
  //     name: req.body.name,
  //     surname: req.body.surname,
  //     title: req.body.title,
  //     status: true,
  //   };
  //   const schema = Joi.object().keys({
  //     email: Joi.string().email().required(),
  //     password: Joi.string().min(4).max(64).required(),
  //     roles: Joi.array().items(Joi.string()),
  //     title: Joi.string().required(),
  //     name: Joi.string().required(),
  //     surname: Joi.string().required(),
  //     status: Joi.boolean().required(),
  //   });
    

  //   const { value, error } = Joi.validate(dataData, schema);
  //   if(error) {
  //     return next(error);
  //   }
    
  //   try {
  //     const existData = await Data.findOne({email: value.email});
  //     if(existData) {
  //       return res.status(422).send({error: 'That email address is already in use'});
  //     }
      
  //     const newData = new Data(value);
  //     const data = await newData.save();
  //     const dataInfo =setDataInfo(data);
  //     res.status(201).json({
  //       token: 'JWT ' + generateToken(dataInfo),
  //       data: dataInfo
  //     })

  //   } catch (err) {
  //     return next(err);
  //   }
  // },
  // async updateData(req, res, next) {
  //   const dataData = {
  //     _id: req.body._id,
  //     email: req.body.email,
  //     roles: req.body.roles===undefined?[defaultRoleType]:Array.isArray(req.body.roles)?req.body.roles:[req.body.roles],
  //     name: req.body.name,
  //     surname: req.body.surname,
  //     title: req.body.title,
  //     status: req.body.status,
  //   };
  //   const schema = Joi.object().keys({
  //     _id: Joi.string().required(),
  //     email: Joi.string().email().required(),
  //     roles: Joi.array().items(Joi.string()),
  //     title: Joi.string().required(),
  //     name: Joi.string().required(),
  //     surname: Joi.string().required(),
  //     status: Joi.boolean().required(),
  //   });
    

  //   const { value, error } = Joi.validate(dataData, schema);
  //   if(error) {
  //     return next(error);
  //   }
    
  //   try {
  //     const existData = await Data.findOne({_id: dataData._id});
      
  //     existData.email = dataData.email;
  //     existData.roles = dataData.roles;
  //     existData.name = dataData.name;
  //     existData.surname = dataData.surname;
  //     existData.title = dataData.title;
  //     existData.status = dataData.status;
      
  //     const data = await existData.save();
  //     const dataInfo =setDataInfo(data);
  //     res.status(201).json({
  //       data: dataInfo
  //     })

  //   } catch (err) {
  //     return next(err);
  //   }
  // },
  // async deleteData(req, res, next) {
  //   try {
  //     const data = await Data.remove({_id: req.params.data_id});
  //     return data.json();
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send(error); 
  //   }
  // },
  // async setDataStatus(req, res, next) {
  //   const dataData = {
  //     _id: req.body._id,
  //     status: req.body.status==='true',
  //   };
  //   const schema = Joi.object().keys({
  //     _id: Joi.string().required(),
  //     status: Joi.boolean().required(),
  //   });
    

  //   const { value, error } = Joi.validate(dataData, schema);
  //   if(error) {
  //     return next(error);
  //   }
    
  //   try {
  //     const existData = await Data.findOne({_id: dataData._id});   
  //     existData.status = dataData.status;
      
  //     const data = await existData.save();
  //     const dataInfo =setDataInfo(data);
  //     res.status(201).json({
  //       data: dataInfo
  //     })

  //   } catch (err) {
  //     return next(err);
  //   }
  // },
}

