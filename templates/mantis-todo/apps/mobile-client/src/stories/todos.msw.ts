import { rest } from 'msw';
import { Todo } from 'app/services/todos.service';

export const defaultTodoHandlers = [
  rest.get('/todos', (_, res, ctx) =>
    res(
      ctx.json([
        {
          _id: '1',
          title: 'Learn Mantis',
          completed: true,
        },
        {
          _id: '2',
          title: 'Ship your awesome app',
          completed: false,
        },
        {
          _id: '3',
          title: 'Tell everyone about Mantis',
          completed: false,
        },
      ] satisfies Todo[]),
    ),
  ),
  rest.post('/todos', (req, res, ctx) =>
    res(
      ctx.json({
        _id: Date.now().toString(),
        ...req.json(),
      }),
    ),
  ),
  rest.patch('/todos/:id', (req, res, ctx) => res(ctx.json(req.json()))),
  rest.delete('/todos/:id', (req, res, ctx) => res(ctx.status(200))),
];
