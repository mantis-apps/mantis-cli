import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbProviderService } from './dbProvider.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [DbModule],
      inject: [DbProviderService],
      async useFactory(dbProvider: DbProviderService) {
        return await dbProvider.getDbUrl();
      },
    }),
  ],
  providers: [DbProviderService],
  exports: [DbProviderService],
})
export class DbModule {}
