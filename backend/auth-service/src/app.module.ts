import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/postgres.db';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
