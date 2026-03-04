import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    //头像
    avatar: { type: String, default: '/public/man.jpg' },
    Introduction: { type: String, default: '还没有自我介绍' },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    // 我关注的人
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    // 关注我的人（粉丝）
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

export default mongoose.model('User', UserSchema)
