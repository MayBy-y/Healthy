import mongoose from 'mongoose'

const weightSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    idealWeight: {
        type: Number,
        default: null
    },
    weight: {
        type: Number,
        default: null
    },
}, {
    timestamps: true
});
export default mongoose.model('Weight', weightSchema)