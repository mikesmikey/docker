import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
export const connectDatabase = () => mongoose.connect(
        `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017/${process.env.MONGO_DB}`, 
        { useCreateIndex: true, useNewUrlParser: true });