import mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            maxlength: 500,
        },

        articleId: {
            type: Schema.Types.ObjectId,
            ref: 'Article',
            index: true,
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // 父评论
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
            index: true,
        },

        // 根评论（用于快速查一棵树）
        rootId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
            index: true,
        },

        // 回复某人
        replyTo: {
            type: String,
            ref: 'User',
            default: null,
        },

        // 点赞
        likes: {
            type: Number,
            default: 0,
        },
        //点赞用户
        likedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        // 软删除
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

export default mongoose.model('Comment', CommentSchema)