import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
