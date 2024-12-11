import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';
import { User } from '../users/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
    ) {}

    async createComment(createCommentDto: CommentDto, userId: string, postId: string): Promise<CommentEntity> {
        const user = await this.userRepository.findOneBy({
            id: userId
        });

        if (!user) {
            throw new Error('User not found');
        }

        const post = await this.postRepository.findOneBy({
            id: postId
        });

        if (!post) {
            throw new Error('Post not found');
        }

        const comment = {
            creator: user,
            post: post,
            ...createCommentDto
        }

        const newComment = this.commentRepository.create(comment);

        return this.commentRepository.save(newComment);
    }

    async findAll(postId: string): Promise<CommentEntity[]> {
        const allComments = await this.commentRepository.find({
            where: { post: { id: postId } },
            relations: ['creator'],
            select: {
                creator: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        });

        return allComments
    }

    async remove(id: string): Promise<void> {
        await this.commentRepository.delete({ id: id });
    }
}
