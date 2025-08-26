import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosModule } from './cursos/cursos.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';


@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: (process.env.TYPE as 'postgres' | 'mysql') ?? 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.PORT_DATABASE ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.PASSWORD_DATABASE,
      database: process.env.NAME_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    CursosModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
