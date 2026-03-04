import mongoose from 'mongoose'

const { Schema } = mongoose

const LikeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        articleId: {
            type: Schema.Types.ObjectId,
            ref: 'Article',
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
)

LikeSchema.index({ userId: 1, articleId: 1 }, { unique: true })

export default mongoose.model('Like', LikeSchema)