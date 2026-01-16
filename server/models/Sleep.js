import mongoose from 'mongoose'


const sleepData = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    targetHour: {
        type: Number,
        default: null
    },
    targetMin: {
        type: Number,
        default: null
    },
    actualHour: {
        type: Number,
        default: null
    },
    actualMin: {
        type: Number,
        default: null
    },
}, {
    timestamps: true
});
export default mongoose.model('Sleep', sleepData)