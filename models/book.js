import mongoose from "mongoose";
import path from "path";

const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

//const bookTemp = mongoose.model('Book', bookSchema);

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName);
    }
})

export default mongoose.model('Book', bookSchema);
export const cIBP = coverImageBasePath;
