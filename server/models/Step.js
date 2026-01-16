import mongoose from 'mongoose'

const StepSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    idealSteps: {
        type: Number,
        default: null
    },
    // 步数
    steps: {
        type: Number,
        default: null
    },
}, {
    timestamps: true
});
export default mongoose.model('Step', StepSchema)