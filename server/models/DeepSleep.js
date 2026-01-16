import mongoose from 'mongoose'

const Deeply = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    sleepStart: { type: Date, required: true },
    sleepEnd: { type: Date, required: true },
    deepSleepDuration: { type: Number, required: true },
    lightSleepDuration: { type: Number, required: true },
    awakeDuration: { type: Number, required: true },
    totalSleepDuration: { type: Number, required: true },
    efficiency: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('DeepSleep', Deeply)