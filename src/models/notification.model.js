import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, { timestamps: true });


export const NotificationModel = mongoose.model('Notification', NotificationSchema)