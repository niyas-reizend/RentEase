import { log } from "console";
import dataSource from "../database/datasource";
import { AgentCommission } from "../entities/AgentCommission";
import { Agreement } from "../entities/Agreement";
import { Booking, BookingStatus } from "../entities/Booking";
import { Property } from "../entities/Property";
import { TenantProfile } from "../entities/TenantProfile";
import { User } from "../entities/User";

const bookingRepo = dataSource.getRepository(Booking);
const propertyRepo = dataSource.getRepository(Property);
const userRepo = dataSource.getRepository(User);
const agreementRepo = dataSource.getRepository(Agreement);
const commisionRepo = dataSource.getRepository(AgentCommission);
const tenantProfileRepo = dataSource.getRepository(TenantProfile);

// create booking
export const createBooking = async (
  tenantId: number,
  propertyId: number,
  rentAmount: number,
  fixedDeposit: number,
  agreementStartDate: Date,
  agreementEndDate: Date
) => {
  const property = await propertyRepo.findOne({
    where: { id: propertyId },
    relations: ["owner"],
  });
  if (!property) throw new Error("Property not found");

  const tenant = await tenantProfileRepo.findOne({
    where: { user: { id: tenantId } },
    relations: ["user"],
  });

  if (!tenant) throw new Error("tenant profile doesnt exists");

  if (!tenant.isVerified)
    throw new Error(
      "tenant is not verified,you have to get verified before booking"
    );

  // if(!verifiedTenant && !verifiedTenant.isVerified) throw new Error("tenant not verified")

  const booking = bookingRepo.create({
    tenant: tenant?.user,
    property,
    rentAmount,
    fixedDeposit,
    agreementStartDate,
    agreementEndDate,
    status: BookingStatus.PENDING,
  });

  return await bookingRepo.save(booking);
};

// approve or update booking status
export const updateBookingStatus = async (
  bookingId: number,
  status: BookingStatus
) => {
  try {
  } catch (err) {}
  const booking = await bookingRepo.findOne({
    where: { id: bookingId },
    relations: ["tenant", "property", "property.owner", "property.agent"],
  });
  if (!booking) throw new Error("Booking not found");

  booking.status = status;
  if (status === BookingStatus.REJECTED || status === BookingStatus.PENDING) {
    let data = await bookingRepo.save(booking);
    return { success: true, message: "updated successfully", data };
  }

  //   If status is "confirmed", create agreement first
  if (status === BookingStatus.CONFIRMED) {
    // console.log(booking);
    // check if tenant already has an agreement
    const existingAgreement = await agreementRepo.findOne({
      where: { tenant: { id: booking.tenant.id } },
    });

    if (existingAgreement) {
      throw new Error("This tenant already has an agreement.");
    }
    // Create agreement using booking details
    const agreement = agreementRepo.create({
      rentAmount: booking?.rentAmount,
      fixedDeposit: booking?.fixedDeposit,
      startDate: booking?.agreementStartDate,
      endDate: booking?.agreementEndDate,
      tenant: booking?.tenant,
      owner: booking?.property.owner,
      property: booking?.property,
    });

    booking.status = BookingStatus.CREATED;

    await bookingRepo.save(booking);

    const test = await bookingRepo.find({ where: { id: bookingId } });

    let agreementDetails = await agreementRepo.save(agreement);
    let agentIdforCommision = booking.property.agent;
    let commissionproperty = booking.property;
    let rentforCommision = booking.rentAmount * 0.5;

    const commission = commisionRepo.create({
      agent: agentIdforCommision,
      property: commissionproperty,
      commissionAmount: rentforCommision,
    });

    await commisionRepo.save(commission);

    return {
      success: true,
      message: "Agreement created successfully",
      agreementDetails,
      commission,
    };
  }
};

// export const getBookingsForProperty = async (propertyId: number) => {
//   return await bookingRepo.find({
//     where: { property: { id: propertyId } },
//     relations: ["tenant", "property"]
//   });
// };

// get the booking of the tenant
export const getTenantBookings = async (tenantId: number) => {
  return await bookingRepo.find({
    where: { tenant: { id: tenantId } },
    relations: ["tenant", "property"],
  });
};

// get the bookings related to that owner
export const getOwnerBookings = async (ownerId: number) => {
  return await bookingRepo.find({
    where: { property: { owner: { id: ownerId } } },
    relations: ["tenant", "property"],
    order: { bookingDate: "ASC" },
  });
};

// get booked properties by owner id 
export const getBookedPropertiesByOwnerId = async(ownerId:number)=>{
  return await bookingRepo.find({
    where:{property:{owner:{id:ownerId}}},
    relations:["property"]
  })
}


