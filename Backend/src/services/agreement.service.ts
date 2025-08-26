import { Agreement } from "../entities/Agreement";
import { User } from "../entities/User";
import { Property } from "../entities/Property";
import dataSource from "../database/datasource";

  const agreementRepo = dataSource.getRepository(Agreement);
  const userRepo = dataSource.getRepository(User);
  const propertyRepo = dataSource.getRepository(Property);

export const createAgreement = async (data: {
  rentAmount: number;
  fixedDeposit: number;
  startDate: Date;
  endDate: Date;
  tenantId: number;
  ownerId: number;
  propertyId: number;
}) => {


  const tenant = await userRepo.findOneBy({ id: data.tenantId });
  const owner = await userRepo.findOneBy({ id: data.ownerId });
  const property = await propertyRepo.findOneBy({ id: data.propertyId });

  if (!tenant || !owner || !property) {
    throw new Error("Invalid tenant, owner, or property ID");
  }

  const agreement = agreementRepo.create({
    rentAmount: data.rentAmount,
    fixedDeposit: data.fixedDeposit,
    startDate: data.startDate,
    endDate: data.endDate,
    tenant,
    owner,
    property,
  });

  return await agreementRepo.save(agreement);
};

// get all agreement 
export const getAllAgreements = async () => {
  const agreementRepo = dataSource.getRepository(Agreement);

  return await agreementRepo.find({
    relations: ["tenant", "owner", "property","property.agent"],
    order: { createdAt: "DESC" },
  });
};


// get agreement by agreement id 
export const getAgreementById = async (id: number) => {
  const agreement = await agreementRepo.findOne({
    where: { id },
    relations: ["tenant", "owner", "property"],
  });

  if (!agreement) throw new Error("Agreement not found");
  return agreement;
};

// Get agreements by tenantId
export const getAgreementsByTenantId = async (tenantId: number) => {
  const agreements = await agreementRepo.find({
    where: { tenant: { id: tenantId } },
    relations: ["tenant", "property","property.agent","owner"], // optional, include related entities
  });

  if (!agreements || agreements.length === 0) {
    throw new Error("No agreements found for this tenant");
  }

  return agreements;
};

// Get agreements by tenantId
export const getAgreementsByOwnerId = async (ownerId: number) => {
  console.log(ownerId);

  const agreements = await agreementRepo.find({
    where: { owner: { id: ownerId } },
    relations: ["tenant", "property", "property.agent","owner"], // to get all the details related to agreement 
  });

  if (!agreements || agreements.length === 0) {
    throw new Error("No agreements found for this owner");
  }

  return agreements;
};
