import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Property } from "./Property";
import { Agreement } from "./Agreement";
import { AgentCommission } from "./AgentCommission";
import { ResetToken } from "./ResetToken";
import { Enquiry } from "./Enquiry";
import { TenantProfile } from "./TenantProfile";
import { Booking } from "./Booking";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'tenant', 'owner', 'agent'] })
  role: 'admin' | 'tenant' | 'owner' | 'agent';

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Property, property => property.owner)
  properties: Property[];

  @OneToMany(() => Booking, (booking) => booking.tenant)
  bookings: Booking[];

  @OneToMany(() => Property, property => property.agent)
  handledProperties: Property[];

  @OneToOne(() => TenantProfile, tenantProfile => tenantProfile.user)
  tenantProfile: TenantProfile;

  @OneToMany(() => Enquiry, enquiry => enquiry.tenant)
  enquiries: Enquiry[];

  @OneToOne(() => Agreement, agreement => agreement.tenant)
  tenantAgreement: Agreement;

  @OneToMany(() => Agreement, agreement => agreement.owner)
  ownerAgreements: Agreement[];

  @OneToMany(() => AgentCommission, commission => commission.agent)
  commissions: AgentCommission[];

  @OneToMany(() => ResetToken, token => token.user)
  resetTokens: ResetToken[];
}
