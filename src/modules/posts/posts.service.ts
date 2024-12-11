import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostDto } from './dto/post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createPost(createPostDto: PostDto, userId: string): Promise<PostEntity> {
        const user = await this.userRepository.findOneBy({
            id: userId
        });

        const post = {
            creator: user,
            name: `${user.firstName} ${user.lastName}`,
            ...createPostDto
        }

        const newPost = this.postRepository.create(post);

        return this.postRepository.save(newPost)
    }

    async findAll(): Promise<PostEntity[]> {
        return await this.postRepository.find({
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
    }

    async getPostBySearch(searchQuery: string, tags: string): Promise<{ data: PostEntity[] }> {
        try {
          const queryBuilder = this.postRepository.createQueryBuilder('post').leftJoinAndSelect('post.creator', 'creator');
      
          // Search query for title
          if (searchQuery) {
            queryBuilder.andWhere('post.title ILIKE :title', { title: `%${searchQuery}%` });
          }
      
          // Search by tags (if provided)
          if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            
            // We'll use OR conditions for each tag
            tagArray.forEach(tag => {
                queryBuilder.orWhere('LOWER(post.tags) LIKE LOWER(:tag)', { tag: `%${tag}%` });
            });
          }
      
          // Execute the query
          const posts = await queryBuilder.getMany();
      
          if (!posts || posts.length === 0) {
            throw new NotFoundException('No posts found matching the criteria.');
          }
      
          return { data: posts };
        } catch (error) {
          throw new NotFoundException(error.message);
        }
    }    

    async findOne(id: string): Promise<PostEntity | undefined> {
        return await this.postRepository.findOne({ where: { id } });
    }

    async update(postId: string, userId: string, updatePostDto: PostDto): Promise<any> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['creator']
        });

        if (!post) {
          throw new Error('Post not found');
        }

        const user = await this.userRepository.findOneBy({
            id: userId
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (post?.creator?.id !== user?.id) {
            throw new Error('Only the creator of the post is allowed to update it.');
        }


        Object.assign(post, updatePostDto);
        return await this.postRepository.save(post);
    }

    async like(postId: string, userId: string): Promise<PostEntity> {
        const post = await this.findOne(postId);
        if (!post) {
          throw new Error('Post not found');
        }
        
        const updatedPost = {
            ...post,
            likes: post?.likes?.includes(userId)
                ? post.likes.filter((id) => id !== userId)
                : [...(post?.likes || []), userId],
        };

        Object.assign(post, updatedPost);
        return await this.postRepository.save(post);
    }
    
    async remove(id: string): Promise<void> {
        await this.postRepository.delete({ id: id });
    }
}
