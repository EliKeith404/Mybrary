import mongoose from "mongoose";
import Book from "./book.js";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// Before deleting an Author, check if they have books and if so, throw an error
authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err);
        } else if (books.length > 0) {
            next(new Error('This author has books still'));
        } else {
            next();
        }
    });
});

const authorModel = mongoose.model('Author', authorSchema);
export default authorModel;