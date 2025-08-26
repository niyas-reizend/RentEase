import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";




@Entity()
export class TenantProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.tenantProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  identityDocumentUrl: string;

  @Column({ default: false })
  isVerified: boolean;
}
