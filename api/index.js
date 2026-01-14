import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'dotenv/config.js';

// NOTE: Add the version route here!
// import v1 from './routes/v1/index.js'; // NOTE: This is for mongodb
import v2 from './routes/v2/index.js'; // NOTE: This is for mysql/mariadb

const app = express();
const port = process.env.API_PORT || 4000;

app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// NOTE: Implement the route versions here!
// app.use('/v1', cors(), v1);
app.use('/v2', cors(), v2);

app.listen(port, () => {
    console.log(`[RUNNING] API is up and running at port ${port}...`);
})
