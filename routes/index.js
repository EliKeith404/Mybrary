import express from "express";

import Book from '../models/book.js';

const router = express.Router();

router.get('/', async (req, res) => {
    let books;
    try {
        books = await Book.find().sort({ createAt: 'desc' }).limit(10).exec();
    } catch (error) {
        books = [];
    }
    res.render('index', { books: books });
});

export default router;