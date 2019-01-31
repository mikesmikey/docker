import Product from '../models/product';
import Joi from 'joi';
import '../../config/passport'; // Must have fix issue : Fix Error: Unknown authentication strategy "local"
import {generateToken} from './authentication';
import {roleType, defaultRoleType} from '../../config/role';
import {sleep} from '../utils/func'
const setProductInfo = function(request) {
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
export default {
  
  async getProducts(req, res, next) {
    
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
      // await sleep(2000);
      const products = await Product.paginate({}, options);
      return res.status(201).json(products);

    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
    
  
  },
  async getProduct(req, res, next) {
    try {
      console.log(req.params.id);
      // await sleep(2000);
      const product = await Product.findById(req.params.id).select('_id email roles name surname title status');
      
      console.log(product);
      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
    
  },
  async createProduct(req, res, next) {
    console.dir(req.body);
       
    const productData = {
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
    

    const { value, error } = Joi.validate(productData, schema);
    if(error) {
      return next(error);
    }
    
    try {
      const existProduct = await Product.findOne({email: value.email});
      if(existProduct) {
        return res.status(422).send({error: 'That email address is already in use'});
      }
      
      const newProduct = new Product(value);
      const product = await newProduct.save();
      const productInfo =setProductInfo(product);
      return res.status(201).json({
              product: productInfo
      });

    } catch (err) {
      return next(err);
    }
  },
  async updateProduct(req, res, next) {
    const productData = {
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
    

    const { value, error } = Joi.validate(productData, schema);
    if(error) {
      return next(error);
    }
    
    try {
      const existProduct = await Product.findOne({_id: productData._id});
      
      existProduct.email = productData.email;
      existProduct.roles = productData.roles;
      existProduct.name = productData.name;
      existProduct.surname = productData.surname;
      existProduct.title = productData.title;
      existProduct.status = productData.status;
      
      const product = await existProduct.save();
      const productInfo =setProductInfo(product);
      res.status(201).json({
        product: productInfo
      })

    } catch (err) {
      return next(err);
    }
  },
  async deleteProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndRemove(req.params.id);
      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error); 
    }
  },
  async setProductStatus(req, res, next) {
    const productData = {
      _id: req.body._id,
      status: req.body.status==='true',
    };
    const schema = Joi.object().keys({
      _id: Joi.string().required(),
      status: Joi.boolean().required(),
    });
    

    const { value, error } = Joi.validate(productData, schema);
    if(error) {
      return next(error);
    }
    
    try {
      const existProduct = await Product.findOne({_id: productData._id});   
      existProduct.status = productData.status;
      
      const product = await existProduct.save();
      const productInfo =setProductInfo(product);
      res.status(201).json({
        product: productInfo
      })

    } catch (err) {
      return next(err);
    }
  },
}

