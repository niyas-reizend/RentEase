import dataSource from "../database/datasource";
import { AgentCommission } from "../entities/AgentCommission";
import { Agreement } from "../entities/Agreement";
import { Booking } from "../entities/Booking";
import { Property } from "../entities/Property";
import { User } from "../entities/User";



const commissionRepo = dataSource.getRepository(AgentCommission);
const propertyRepo = dataSource.getRepository(Property);
const userRepo = dataSource.getRepository(User);
const bookinRepo = dataSource.getRepository(Booking)

// export const createAgentCommission = async (
//   agentId: number,
//   propertyId: number,
// ) => {
//   const agent = await userRepo.findOneBy({ id: agentId });
//   const property = await propertyRepo.findOne({
//     where: { id: propertyId }
//   });
//   if (!agent || !property) throw new Error("Agent or Property not found");

//   const existing = await commissionRepo.findOneBy({
//     property: { id: propertyId },
//   });

//   if (existing) throw new Error("Commission for this property already exists");
//   const booking = await bookinRepo.findOne({where:{property:{id:propertyId}}})
//   console.log(booking)
//   if (!property.agreements) throw new Error("No agreement found for this property");


//   const rentAmount = parseFloat(property.agreements.rentAmount.toString());
  // const rentAmount = booking?.property?.rentAmount
  // const commissionAmount = rentAmount * 0.5;

  // const commission = commissionRepo.create({
  //   agent,
  //   property,
  //   commissionAmount,
  // });

  // return await commissionRepo.save(commission);
// };

export const getAllCommissionsByAgentId = async (agentId:number) => {
  return await commissionRepo.find({
    where:{agent:{id:agentId}},
    relations: ["agent", "property","property.owner"],
    order: { createdAt: "DESC" }
  });
};

export const getCommissionById = async (id: number) => {
  const commission = await commissionRepo.findOne({
    where: { id },
    relations: ["agent", "property"]
  });
  if (!commission) throw new Error("Commission not found");
  return commission;
};
