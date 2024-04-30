import { MongoMemoryServer } from 'mongodb-memory-server';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'node:net';
import { ensureDir } from 'fs-extra';

const port = 27017;
const uri = `mongodb://127.0.0.1:${port}`;
const dbPath = join(tmpdir(), 'mantis-todo-db');
if (await isPortInUse(27017)) {
  console.log(
    `Local database already running at uri: ${uri}, dbPath: ${dbPath}`,
  );
} else {
  await ensureDir(dbPath);
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
}

function isPortInUse(port) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', (err) => {
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
