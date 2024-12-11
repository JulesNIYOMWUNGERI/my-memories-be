import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { UserRoleEnum } from '../enums/userRoles.enum';

export class JwtClaimsDataDto {
  @IsUUID()
  @IsNotEmpty()
  sub: string;

  @IsNotEmpty()
  role: UserRoleEnum;

  @IsOptional()
  email: string;
}
