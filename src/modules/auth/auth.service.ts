import { UsersService } from '../users/users.service';
import { forwardRef, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateOwner(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Invalid email or password',
            errorCode: 'AUTHENTICATION_FAILED',
        });
    }

    async login(loginDto: LoginDto) {
        const owner = await this.validateOwner(loginDto.email, loginDto.password);
        const payload = { email: owner.email, sub: owner.id, role: owner.role };

        const access_token = this.jwtService.sign(payload);
        return {
          access_token,
          userInfo: {
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
          },
        };
    }
}
