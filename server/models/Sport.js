import mongoose from 'mongoose'

const SportSchame = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        calories: {
            type: Number,
            default: 0
        },
        note: {
            type: String,
            default: ''
        },
    }
)
export default mongoose.model('sports', SportSchame)