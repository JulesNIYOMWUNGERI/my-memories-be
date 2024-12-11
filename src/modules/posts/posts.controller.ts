import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';
import { PostEntity } from './entities/post.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { JwtClaimsDataDto } from 'src/common/dtos/jwt-data.dto';

@ApiTags('POSTS')
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiResponse({
      status: 201,
      description: 'The post has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Invalid data input.' })
    async create(
        @Body() createPostDto: PostDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<PostEntity> {
        const { sub } = authUser;
        try {
            return await this.postsService.createPost(createPostDto, sub);
        } catch (error) {
            throw new HttpException('Failed to create post', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    @ApiResponse({ status: 200, description: 'List of all posts.' })
    async findAll() {
      return this.postsService.findAll();
    }

    @Get('/search')
    @ApiQuery({ name: 'searchQuery', required: false, type: String, description: 'Search query for post titles' })
    @ApiQuery({ name: 'tags', required: false, type: String, description: 'Comma-separated tags to filter posts' })
    @ApiResponse({ status: 200, description: 'List of all posts matching the search criteria.' })
    async findBySearch(
        @Query('searchQuery') searchQuery?: string,
        @Query('tags') tags?: string,
    ) {
        return this.postsService.getPostBySearch(searchQuery || '', tags || '');
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Patch('/update/:postId')
    async update(
        @Param('postId') postId: string, 
        @Body() updatePostDto: PostDto,
        @AuthUser() authUser: JwtClaimsDataDto,
    ) {
        const { sub } = authUser;
        try {
            const updatedPost = await this.postsService.update(postId, sub, updatePostDto);
            return updatedPost;
        } catch (error) {
            throw new HttpException(error.message || 'Failed to update post', HttpStatus.BAD_REQUEST);
        }
    }    

    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Put('/like/:postId')
    @ApiResponse({
        status: 200,
        description: 'Post liked successfully.',
    })
    async likePost(
        @Param('postId') postId: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ) {
        const { sub } = authUser;
        try {
            const likeOnPost = await this.postsService.like(postId, sub);
            return likeOnPost;
        } catch (error) {
            throw new HttpException(error.message || 'Failed to like post', HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.postsService.remove(id);
    }
}
