import express from 'express';


const PORT = 4000;

const app = express();


app.listen(process.env.PORT||PORT, () => {
  console.log(`App listening on port ${process.env.PORT||PORT}!`);
});
