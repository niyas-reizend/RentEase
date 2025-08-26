import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.resetTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;
}
