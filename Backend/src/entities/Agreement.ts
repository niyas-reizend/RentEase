import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Property } from "./Property";

@Entity()
export class Agreement {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('decimal')
  rentAmount: number;
  
  @Column('decimal')
  fixedDeposit: number;
  
  @Column({ type: 'date'  })
  startDate: Date;
  
  @Column({ type: 'date' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, user => user.tenantAgreement, { onDelete: 'CASCADE' })
  @JoinColumn()
  tenant: User;
  
  @ManyToOne(() => User, user => user.ownerAgreements, { onDelete: 'CASCADE' })
  owner: User;
  
  @ManyToOne(() => Property, property => property.agreements, { onDelete: 'CASCADE' })
  property: Property;
}
