import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CommentDto {
  @ApiProperty({
    example: 'This is the comment',
    description: 'Comment of the post',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
