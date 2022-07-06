import mongoose from "mongoose";
import Book from "./book.js";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

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

const authorTemp = mongoose.model('Author', authorSchema);
export default authorTemp;