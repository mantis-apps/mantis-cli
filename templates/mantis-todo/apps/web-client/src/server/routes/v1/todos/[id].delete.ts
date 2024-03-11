import { defineEventHandler, getRouterParam } from 'h3';
import { useTodo } from '../../../schemas/todo.schema';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const Todo = await useTodo();
  return await Todo.findByIdAndDelete({ _id: id }).exec();
});
