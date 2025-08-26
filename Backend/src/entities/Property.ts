import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Enquiry } from "./Enquiry";
import { AgentCommission } from "./AgentCommission";
import { Agreement } from "./Agreement";
import { Booking } from "./Booking";


export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}


@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal')
  rentAmount: number;

  @Column('decimal')
  fixedDepositAmount: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column("text", { array: true })
  images: string[];

  @Column("text", { array: true })
  amenities: string[];

  @Column({ 
    type:"enum",
    enum:ApprovalStatus,
    default:"pending"})
  isApproved: ApprovalStatus;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, user => user.properties, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Column({ nullable: true })
  agentId: number;

  @ManyToOne(() => User, user => user.handledProperties, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "agentId" })
  agent: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Enquiry, enquiry => enquiry.property)
  enquiries: Enquiry[];

  @OneToMany(() => Booking, (booking) => booking.property)
  bookings: Booking[];

  @OneToMany(() => Agreement, agreement => agreement.property)
  agreements: Agreement[];

  @OneToOne(() => AgentCommission, commission => commission.property)
  commission: AgentCommission;
}
