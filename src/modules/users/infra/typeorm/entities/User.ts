import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  @Exclude()
  password: string;

  @Column('varchar')
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  get getAvatarUrl(): string | null {
    switch (uploadConfig.driver) {
      case 'disk':
        if (!this.avatar) {
          return `${process.env.APP_API_URL}/files/user-null.png`;
        }
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case 's3':
        if (!this.avatar) {
          return `https://${process.env.BUCKET_S3}.s3.us-east-2.amazonaws.com/user-null.png`;
        }
        return `https://${process.env.BUCKET_S3}.s3.us-east-2.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
