import mongoose from 'mongoose'

const MoodSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    IdealMood: {
        type: String,
        default: null
    },
    // 心情
    mood: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
export default mongoose.model('Mood', MoodSchema)