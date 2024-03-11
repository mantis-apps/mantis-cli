import { Schema } from 'mongoose';
import { useModel } from '../db/mongo';

const TodoSchema = new Schema({
  title: String,
  completed: Boolean,
});

export const useTodo = async () => useModel('Todo', TodoSchema);
