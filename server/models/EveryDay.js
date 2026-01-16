import mongoose from 'mongoose'

const Everyday = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    sleepword: {
        type: String,
        default: null
    },
    sportword: {
        type: String,
        default: null
    },
    eatword: {
        type: String,
        default: null
    },
    moodword: {
        type: String,
        default: null
    },
}, {
    timestamps: true
}
);
//确保数据库中只有一条同一用户同一日期的数据
Everyday.index(
    { user_id: 1, date: 1 },
    { unique: true }
);
export default mongoose.model('EveryDay', Everyday)