import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    UsersModule
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [TypeOrmModule],
})
export class PostsModule {}
