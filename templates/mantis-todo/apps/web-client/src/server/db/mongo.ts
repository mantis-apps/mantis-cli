import mongoose, {
  type model,
  type Schema,
  type CompileModelOptions,
} from 'mongoose';

let cachedConnection: typeof mongoose | null = null;
export async function getConnection(): Promise<typeof mongoose> {
  if (cachedConnection) {
    return cachedConnection;
  }
  const uri = getUri();
  const newConnection = await mongoose.connect(uri);
  cachedConnection = newConnection;
  return newConnection;
}

export const useModel = async function <TSchema extends Schema>(
  name: string,
  schema?: TSchema,
  collection?: string,
  options?: CompileModelOptions,
) {
  const conn = await getConnection();
  return conn.models[name]
    ? conn.models[name]
    : conn.model(name, schema, collection, options);
} as typeof model;

function getUri(): string {
  const uri = import.meta.env.MONGODB_URI;
  if (typeof uri !== 'string') {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  return uri;
}
