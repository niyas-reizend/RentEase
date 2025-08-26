// services/EnquiryService.ts
import { Enquiry } from "../entities/Enquiry";
import { User } from "../entities/User";
import { Property } from "../entities/Property";
import dataSource from "../database/datasource";


type EnquiryInput = {
  tenantId: number;
  propertyId: number;
  message: string;
};
  const enquiryRepo = dataSource.getRepository(Enquiry);
  const userRepo = dataSource.getRepository(User);
  const propertyRepo = dataSource.getRepository(Property);

// create enquiry  
export const createEnquiry = async ({ tenantId, propertyId, message }: EnquiryInput) => {

  const tenant = await userRepo.findOneBy({ id: tenantId });
  if (!tenant) throw new Error("Tenant not found");

  const property = await propertyRepo.findOneBy({ id: propertyId });
  if (!property) throw new Error("Property not found");

  const newEnquiry = enquiryRepo.create({
    tenant,
    property,
    message,
  });
  return await enquiryRepo.save(newEnquiry);
};


// get enquiry by tenant ID 
export const getEnquiriesByTenant = async (tenantId: number) => {
  const tenant = await userRepo.findOne({ where: { id: tenantId } });
  if (!tenant) throw new Error("Tenant not found");

  const enquiries = await enquiryRepo.find({
    where: { tenant: { id: tenantId } },
    relations: ["property"], // include property details
    order: { createdAt: "DESC" }, // latest first
  });

  return enquiries;
};

// get the enquiry by Owner Id 
export const getEnquiriesByOwner = async (ownerId: number) => {
  // check if owner exists
  const owner = await userRepo.findOne({ where: { id: ownerId } });
  if (!owner) throw new Error("Owner not found");

  // fetch enquiries for all properties owned by this owner
  const enquiries = await enquiryRepo.find({
    where: { property: { owner: { id: ownerId } } },
    relations: ["tenant", "property"], // include both tenant and property details
    order: { createdAt: "DESC" },
  });

  return enquiries;
};



// reply to enquiry 
export const replyToEnquiry = async (id: number, reply: string) => {
  const enquiry = await enquiryRepo.findOneBy({ id });

  if (!enquiry) {
    throw new Error("Enquiry not found");
  }

  enquiry.reply = reply;
  await enquiryRepo.save(enquiry);

  return enquiry;
};
