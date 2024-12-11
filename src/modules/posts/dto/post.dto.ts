import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class PostDto {
  @ApiProperty({
    example: 'title',
    description: 'Title of the post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'This is the description',
    description: 'Description of the post',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Tags of the post',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL of the post',
  })
  @IsString()
  @IsNotEmpty()
  selectedFile: string;
}
