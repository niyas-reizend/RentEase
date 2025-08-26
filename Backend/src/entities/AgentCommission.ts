import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Property } from "./Property";


@Entity()
export class AgentCommission {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('decimal')
  commissionAmount: number; // = 50% of rent
  
  @CreateDateColumn()
  createdAt: Date;
  
    @ManyToOne(() => User, user => user.commissions, { onDelete: 'CASCADE' })
    agent: User;

    @OneToOne(() => Property, property => property.commission, { onDelete: 'CASCADE' })
    @JoinColumn()
    property: Property;
}
