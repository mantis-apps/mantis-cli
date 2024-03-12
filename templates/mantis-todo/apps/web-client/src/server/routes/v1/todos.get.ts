import { defineEventHandler } from 'h3';
import { useTodo } from '../../schemas/todo.schema';

export default defineEventHandler(async () => {
  const Todo = await useTodo();
  return await Todo.find().exec();
});
