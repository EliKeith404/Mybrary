import express from "express";

import Book from '../models/book.js';
import Author from '../models/author.js';

const router = express.Router();
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

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
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        desciption: req.body.desciption,
    });

    saveCover(book, req.body.cover);

    try {
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`);
    } catch (error) {
        renderNewPage(res, book, true);
    }
})

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
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