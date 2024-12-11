import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums/userRoles.enum';

export class CreateUserBasicInfoDto {
  @ApiProperty({ example: 'John', description: 'First name of the user.' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user.' })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user.',
  })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password of the user.',
  })
  password: string;
}