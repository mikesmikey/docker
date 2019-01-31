import Unit, {UnitSchema} from '../models/unit';
import mongoose from 'mongoose';
import Joi from 'joi';
import '../../config/passport'; // Must have fix issue : Fix Error: Unknown authentication strategy "local"
import {generateToken} from './authentication';
import {roleType, defaultRoleType} from '../../config/role';
import {sleep} from '../utils/func'
const setUnitInfo = function(request) {
  return {
    _id: request._id,
    code: request.code,
    description: request.description,
    number: request.number,
  };
}

const fields = '_id code description number';
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
  
  async getUnits(req, res, next) {
    
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
      if(UnitSchema.path(keyword) instanceof mongoose.Schema.Types.String) {
        filter={[keyword]: {'$regex': searchString, '$options' : 'i'}}
      } else if(UnitSchema.path(keyword) instanceof mongoose.Schema.Types.Number) {
        let prepareString = searchString.replace(/ /g,'')
        const {operant, operator} = extract(prepareString);
        console.log({operant, operator});
        const moperator = getMongoNumberOperator(operator);
        filter={[keyword]: {[moperator]: parseFloat(operant)}}
        console.log(filter);
        // filter={[keyword]: searchString}
      }

      
      const units = await Unit.paginate(filter, options);
      return res.status(201).json(units);

    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
    
  
  },
  async getUnit(req, res, next) {
    try {
      console.log(req.params.id);
      // await sleep(2000);
      const unit = await Unit.findById(req.params.id).select(fields);
      
      console.log(unit);
      return res.status(201).json(unit);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
    
  },
  async createUnit(req, res, next) {
    console.dir(req.body);
       
    const unitData = {
      code: req.body.code,
      description: req.body.description,
      number: req.body.number,
    };
    const schema = Joi.object().keys({
      // _id: Joi.string().required(),
      code: Joi.string().min(1).required(),
      description: Joi.string().required(),
      number: Joi.number().required(),
    });
    

    const { value, error } = Joi.validate(unitData, schema);
    if(error) {
      return next(error);
    }
    
    try {
    
      const newUnit = new Unit(value);
      const unit = await newUnit.save();
      const unitInfo =setUnitInfo(unit);
      return res.status(201).json({
              unit: unitInfo
      });

    } catch (err) {
      return next(err);
    }
  },

  async updateUnit(req, res, next) {
    const unitData = {
      _id: req.body._id,
      code: req.body.code,
      description: req.body.description,
      number: req.body.number,
    };
    const schema = Joi.object().keys({
      _id: Joi.string().required(),
      code: Joi.string().min(1).required(),
      description: Joi.string().required(),
      number: Joi.number().required(),
    });
    

    const { value, error } = Joi.validate(unitData, schema);
    if(error) {
      return next(error);
    }
    
    try {
      const existUnit = await Unit.findOne({_id: unitData._id});
      
      existUnit.code = unitData.code;
      existUnit.description = unitData.description;
      existUnit.number = unitData.number;
      const unit = await existUnit.save();
      const unitInfo =setUnitInfo(unit);
      res.status(201).json({
        unit: unitInfo
      })

    } catch (err) {
      return next(err);
    }
  },
  async deleteUnit(req, res, next) {
    try {
      const unit = await Unit.findByIdAndRemove(req.params.id);
      return res.status(201).json(unit);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
  },
  
}

