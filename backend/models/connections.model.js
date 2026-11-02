import mongoose from "mongoose";

const connectionRequest = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status_accepted:{
        type: Boolean,
        default: null,
    }
})

connectionRequest.index({ userId: 1 });
connectionRequest.index({ connectionId: 1 });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequest);
export default ConnectionRequest;