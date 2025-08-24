import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',        
      host: 'dpg-d2lm7715pdvs73atabf0-a.oregon-postgres.render.com',       
      port: 5432,              
      username: 'user_reto',
      password: 'HVKVxbFb3Yyh9Og9kR8zAg3go82sRsRK',
      database: 'cursos_35nb',
      autoLoadEntities: true,  
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },    
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
