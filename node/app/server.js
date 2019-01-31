import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDatabase } from '../config/db'
import router from './routes';

const PORT = 4000;

const app = express();
connectDatabase();


app.listen(process.env.PORT||PORT, () => {
  console.log(`App listening on port ${process.env.PORT||PORT}!`);
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());

router(app);