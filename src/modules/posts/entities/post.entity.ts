import { TableBasicFieldEntity } from 'src/common/entities/basic.entity';
import { CommentEntity } from 'src/modules/comments/entities/comment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class PostEntity extends TableBasicFieldEntity {
    @Column({ type: 'varchar', length: 255 })
    title: string;
    
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => User, (user) => user.posts, { cascade: true })
    creator: User;

    @Column({ type: 'simple-array', nullable: true, default: [] })
    tags: string[] = [];

    @Column({ type: 'varchar' })
    selectedFile: string;

    @Column({ type: 'simple-array', nullable: true })
    likes: string[];

    @OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true, onDelete: 'CASCADE' })
    comments: CommentEntity[];
}
