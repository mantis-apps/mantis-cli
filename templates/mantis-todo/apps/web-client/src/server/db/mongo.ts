import mongoose, {
  type model,
  type Schema,
  type CompileModelOptions,
} from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'node:path';
import { tmpdir } from 'node:os';
import net from 'node:net';
import fs from 'fs-extra';

let cachedConnection: typeof mongoose | null = null;
export async function getConnection(): Promise<typeof mongoose> {
  if (cachedConnection) {
    return cachedConnection;
  }
  const uri = await getUri();
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

let cachedUri: string | null = null;
async function getUri(): Promise<string> {
  if (cachedUri) {
    return cachedUri;
  }
  const uri = import.meta.env.MONGODB_URI;
  if (typeof uri !== 'string') {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  const useLocalDb = uri === 'local';
  if (useLocalDb) {
    const port = 27017;
    const uri = `mongodb://127.0.0.1:${port}`;
    const dbPath = path.join(tmpdir(), 'mantis-todo-db');
    if (await isPortInUse(27017)) {
      console.log(`Local database found at uri: ${uri}, dbPath: ${dbPath}`);
      return uri;
    }
    await fs.ensureDir(dbPath);
    await MongoMemoryServer.create({
      instance: {
        // Without specifying a dbPath a random path will be selected
        dbPath,
        // Without specifying the port a random port will be selected
        port,
        // Persists the data to disk
        storageEngine: 'wiredTiger',
      },
    });
    console.log(`Started local database at uri: ${uri}, dbPath: ${dbPath}`);
    cachedUri = uri;
    return uri;
  } else {
    cachedUri = uri;
    return uri;
  }
}

function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (err: NodeJS.ErrnoException) => {
      server.close();
      if (err.code != 'EADDRINUSE') return reject(err);
      resolve(true);
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}
