import { TableBasicFieldEntity } from "src/common/entities/basic.entity";
import { PostEntity } from "src/modules/posts/entities/post.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CommentEntity extends TableBasicFieldEntity {
    @ManyToOne(() => User, (user) => user.comments, {
        onDelete: 'NO ACTION',
        nullable: false,
    })
    creator: User;

    @Column({ type: 'text' })
    message: string;

    @ManyToOne(() => PostEntity, (post) => post.comments, {
        onDelete: 'NO ACTION',
        nullable: false,
    })
    post: PostEntity;
}