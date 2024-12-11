import { BadRequestException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt'; 
import { UserRoleEnum } from 'src/common/enums/userRoles.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async createUser(createUserDto: UserDto): Promise<User> {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

        const existingOwner = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });
    
        if (existingOwner) {
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            message: 'Email already exists',
            details: {
              email: createUserDto.email,
            },
          });
        }
    
        if (createUserDto.password.length < 8) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Password must be at least 8 characters long',
            details: {
              value: createUserDto.password,
            },
          });
        }
    
        const hashedPassword = await bcrypt.hash(
          createUserDto.password,
          saltRounds,
        );
    
        const owner = this.userRepository.create({
          ...createUserDto,
          role: UserRoleEnum?.USER,
          password: hashedPassword,
        });
    
          
        return await this.userRepository.save(owner);
    }

    async findByEmail(email: string): Promise<User> {
        const owner = await this.userRepository.findOne({ where: { email } });
        if (!owner) {
          throw new UnauthorizedException('User not found');
        }
        return owner;
    }

    async findById(id: string): Promise<User> {
        const owner = await this.userRepository.findOne({ where: { id } });
        if (!owner) {
          throw new UnauthorizedException('User not found');
        }
        return owner;
    }
}
