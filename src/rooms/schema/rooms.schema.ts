import * as mongoose from 'mongoose';

export const RoomsSchema = new mongoose.Schema({
  nome: String,
  criador: String,
  created_at: String,
});
