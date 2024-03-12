import { defineEventHandler } from 'h3';
import { useTodo } from '../../schemas/todo.schema';
import { z } from 'zod';
import { parseBody } from '../../utils/validation';

const createTodoSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
});

export default defineEventHandler(async (event) => {
  const createTodoDto = await parseBody(event, createTodoSchema);
  const Todo = await useTodo();
  return await Todo.create(createTodoDto);
});
