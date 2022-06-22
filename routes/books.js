import express from "express";
import multer from "multer";
import path from 'path';
import fs from 'fs';

import Book from '../models/book.js';
import Author from '../models/author.js';

const router = express.Router();
const uploadPath = path.join('public', 'uploads/bookCovers');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
})

// All Books
router.get('/', async (req, res) => {
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/');
    }
    
});

// New Book
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
})

// Create Book
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        desciption: req.body.desciption,
    });

    try {
        const newBook = await book.save();
        res.redirect(`books`);
    } catch (error) {
        if (book.coverImageName != null){
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, true);
    }
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        console.error(err);
    })
}

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({});
        const params =  {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'error Creating Book';
        res.render('books/new', params)
    } catch (error) {
        res.redirect('/books');
    }
}

export default router;