import { defineEventHandler, getRouterParam } from 'h3';
import { z } from 'zod';
import { useTodo } from '../../../schemas/todo.schema';
import { parseBody } from '../../../utils/validation';

const updateTodoSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const updateTodoDto = await parseBody(event, updateTodoSchema);
  const Todo = await useTodo();
  return await Todo.findByIdAndUpdate({ _id: id }, updateTodoDto, {
    new: true,
  });
});
