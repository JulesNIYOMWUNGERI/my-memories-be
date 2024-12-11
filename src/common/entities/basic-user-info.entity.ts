import { Entity, Column } from "typeorm";
import { TableBasicFieldEntity } from "./basic.entity";
import { UserRoleEnum } from "../enums/userRoles.enum";

@Entity()
export abstract class UserBasicInfoEntity extends TableBasicFieldEntity {
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum })
  role: UserRoleEnum;
}