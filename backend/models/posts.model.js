import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    body:{
        type: String,
        required: true
    },
    // One entry per user who liked the post; the like count is derived from this, never stored separately
    likedBy:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    media:{
        url: {
            type: String,
        },
        filename: {
            type: String,
            default: ''
        }
    },
    active:{
        type: Boolean,
        default: true
    },
    fileType:{
        type: String,
        default: ''
    },
})

postSchema.index({ userId: 1 });

const Post = mongoose.model('Post', postSchema);
export default Post;