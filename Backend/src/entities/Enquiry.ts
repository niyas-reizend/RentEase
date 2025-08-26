import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Property } from "./Property";


@Entity()
export class Enquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.enquiries, { onDelete: 'CASCADE' })
  tenant: User;

  @ManyToOne(() => Property, property => property.enquiries, { onDelete: 'CASCADE' })
  property: Property;

  @Column()
  message: string;

  @Column({ nullable: true })
  reply: string;

  @CreateDateColumn()
  createdAt: Date;
}
