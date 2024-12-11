import { UserBasicInfoEntity } from 'src/common/entities/basic-user-info.entity';
import { CommentEntity } from 'src/modules/comments/entities/comment.entity';
import { PostEntity } from 'src/modules/posts/entities/post.entity';
import { Entity, OneToMany } from 'typeorm';
  
@Entity()
export class User extends UserBasicInfoEntity {
    @OneToMany(() => PostEntity, (post) => post.creator)
    posts: PostEntity[];
    
    @OneToMany(() => CommentEntity, (comment) => comment.creator)
    comments: CommentEntity[];
}
  
