import dotenv from 'dotenv';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import indexRouter from './routes/index.js';
import authorsRouter from './routes/authors.js';
import booksRouter from './routes/books.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout', './layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(methodOverride('_method'));

mongoose.connect(process.env.DATABASE_URL, { UseNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!!`);
});
