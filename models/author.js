import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const authorTemp = mongoose.model('Author', authorSchema);
export default authorTemp;