import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    @Post('/signup')
    @ApiResponse({
      status: 201,
      description: 'The user has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Invalid data input.' })
    async create(@Body() createUserDto: UserDto): Promise<User> {
      return await this.usersService.createUser(createUserDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'List of all users.' })
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }
}
