import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  coins: { type: Number, default: 0 },
  energy: { type: Number, default: 1000 },
  lastLogin: { type: Date, default: Date.now },
  completedTasks: [{ type: String }], // Array of task IDs
});

export default mongoose.models.User || mongoose.model('User', UserSchema);