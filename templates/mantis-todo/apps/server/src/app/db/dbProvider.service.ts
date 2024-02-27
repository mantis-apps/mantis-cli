import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'fs-extra';

@Injectable()
export class DbProviderService implements OnApplicationShutdown {
  private readonly logger = new Logger(DbProviderService.name);
  private mongod?: MongoMemoryServer;

  constructor(private config: ConfigService) {}

  async getDbUrl(): Promise<{ uri: string }> {
    const uri = this.config.get<string>('MONGODB_URI');
    const useLocalDb = uri === 'local';
    if (useLocalDb) {
      const dbPath = path.join(tmpdir(), 'mantis-todo-db');
      await fs.ensureDir(dbPath);
      const mongod = await MongoMemoryServer.create({
        instance: {
          // Without specifying a dbPath a random path will be selected
          dbPath,
          // Without specifying the port a random port will be selected
          port: 27017,
          // Persists the data to disk
          storageEngine: 'wiredTiger',
        },
      });

      this.mongod = mongod;

      const uri = mongod.getUri();
      this.logger.log(
        `Started local database at uri: ${uri}, dbPath: ${dbPath}`
      );
      return {
        uri,
      };
    } else {
      return {
        uri,
      };
    }
  }

  async onApplicationShutdown() {
    if (this.mongod) {
      await this.mongod.stop();
      this.logger.log('Shut down local database');
    }
  }
}
