import dotenv from 'dotenv';
import express from "express";
import expressLayouts from "express-ejs-layouts";
import mongoose from "mongoose";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import indexRouter from './routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

mongoose.connect(process.env.DATABASE_URL, { UseNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!!`);
})