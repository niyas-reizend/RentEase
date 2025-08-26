import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Property } from "./Property";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  CREATED = "agreement_created"
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: "CASCADE" })
  tenant: User; // Tenant who booked

  @ManyToOne(() => Property, (property) => property.bookings, { onDelete: "CASCADE" })
  property: Property; // Property booked

  @Column("decimal", { precision: 10, scale: 2 })
  rentAmount: number; // Rent agreed by tenant

  @Column("decimal", { precision: 10, scale: 2 })
  fixedDeposit: number; // FD agreed by tenant

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @CreateDateColumn()
  bookingDate: Date; // When booking was made

  @Column({ type: "date", nullable: true })
  agreementStartDate: Date;

  @Column({ type: "date", nullable: true })
  agreementEndDate: Date;
}
