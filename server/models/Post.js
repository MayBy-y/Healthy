import mongoose from 'mongoose'
import { type } from 'os'
const PostSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    content: {
        type: String,
        require: true,
        maxlength: 5000
    },
    tags: {
        type: [String],
        default: [] //默认值
    },
    cover: {
        type: String,
        require: true,
    },
    views: {
        type: Number,
        default: 0
    },
    summary: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})
export default mongoose.model('Post', PostSchema)