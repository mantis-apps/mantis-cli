import { readBody, H3Event, EventHandlerRequest, createError } from 'h3';
import type { z } from 'zod';

export const parseBody = async <T extends z.ZodSchema>(
  event: H3Event<EventHandlerRequest>,
  schema: T,
): Promise<z.output<T>> => {
  const body = await readBody(event);
  const result = schema.safeParse(body);
  if (result.success) {
    return result.data;
  } else {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    });
  }
};
