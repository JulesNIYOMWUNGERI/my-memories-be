import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    HttpStatus, 
    Param, 
    Post, 
    UseGuards 
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CommentEntity } from './entities/comment.entity';
import { AuthGuard } from '@nestjs/passport';
import { CommentDto } from './dto/comment.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { JwtClaimsDataDto } from 'src/common/dtos/jwt-data.dto';

@ApiTags('COMMENTS')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Post('/:postId')
    @ApiResponse({ status: 201, description: 'The comment has been successfully created.', type: CommentEntity })
    @ApiResponse({ status: 400, description: 'Invalid data input.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async create(
        @Body() createPostDto: CommentDto,
        @Param('postId') postId: string,
        @AuthUser() authUser: JwtClaimsDataDto,
    ): Promise<CommentEntity> {
        const { sub } = authUser;
        try {
            return await this.commentsService.createComment(createPostDto, sub, postId);
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to create comment',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get('/all/:postId')
    @ApiResponse({ status: 200, description: 'List of all comments.' })
    async findAll(
        @Param('postId') postId: string,
    ): Promise<CommentEntity[]> {
      return this.commentsService.findAll(postId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.commentsService.remove(id);
    }
}
  