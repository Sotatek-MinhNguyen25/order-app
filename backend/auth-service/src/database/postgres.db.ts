import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { authConfig } from 'src/configs/config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: authConfig.DB_HOST,
      port: authConfig.DB_PORT,
      username: authConfig.DB_USER,
      password: authConfig.DB_PASSWORD,
      database: authConfig.DB_NAME,
      synchronize: false,
      entities: [User],
    }),
  ],
})
export class DatabaseModule { }
