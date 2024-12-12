import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  room: String,
  userId: String,
  nickName: String,
  content: String,
  createdAt: Date,
});

MessageSchema.index({ room: 1 });
MessageSchema.index({ createdAt: 1 });
