import dataSource from "../database/datasource";
import { ApprovalStatus, Property } from "../entities/Property";
import { User } from "../entities/User";
import propertyRouter from "../routes/property.route";




type PropertyInput = {
  title: string;
  description: string;
  rentAmount: number;
  fixedDepositAmount: number;
  address: string;
  city: string;
  state: string;
  images: string[];
  amenities: string[];
  ownerId: number;
  agentId: number;
};

const propertyRepo = dataSource.getRepository(Property);
const userRepo = dataSource.getRepository(User);
// to add property 
export const addProperty = async (data: PropertyInput) => {
  const owner = await userRepo.findOneBy({ id: data.ownerId,role:"owner" });
  if (!owner) throw new Error("Owner not found");
  if (owner.role !== "owner") throw new Error("User is not an Owner");
  // console.log(data.agentId);
  const agent = await userRepo.findOneBy({ id: data.agentId,role:"agent" });
  if (!agent) throw new Error("Agent not found");

  const property = propertyRepo.create({
    title: data.title,
    description: data.description,
    rentAmount: data.rentAmount,
    fixedDepositAmount: data.fixedDepositAmount,
    address: data.address,
    city: data.city,
    state: data.state,
    images: data.images,
    amenities: data.amenities,
    owner,
    isApproved: ApprovalStatus.PENDING,
    agent
  });

  return await propertyRepo.save(property);
};


// get all property 
export const getAllProperties = async () => {
  const propertyRepo = dataSource.getRepository(Property);
  return await propertyRepo.find({
    relations: ["owner", "agent"],
    order: { createdAt: "DESC" },
  });
};

// get all unverified Properties 

export const getUnverifiedProperties = async()=>{
  const propertyRepo = dataSource.getRepository(Property);
  return propertyRepo.find({
    where:{isApproved:ApprovalStatus.PENDING},
    relations:["owner","agent"],
    order:{createdAt:"DESC"}
  })
}

// get the properties by owner id 
export const getPropertiesByOwner = async (ownerId: number) => {
  const propertyRepo = dataSource.getRepository(Property);
  return propertyRepo.find({
    where: { ownerId },
    relations: ["agent"], // if you want agent details
    order: { createdAt: "DESC" }
  });
};

// get the properties by agent id 
export const getPropertiesByAgent = async (agentId: number) => {
  const propertyRepo = dataSource.getRepository(Property);
  return propertyRepo.find({
    where: { agentId },
    relations: ["owner","agent"], // if you want agent details
    order: { createdAt: "DESC" }
  });
};


// get the property by property id 
export const getPropertyById = async (id: number) => {
  const property = await propertyRepo.findOne({
    where: { id },
    relations: [
      "owner",
      "agent",
      "enquiries",
      "bookings",
      "agreements",
      "commission"
    ]
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};



// get all propertis for tenants 
export const getAllPropertiesForTenants = async () => {
  const propertyRepo = dataSource.getRepository(Property);
  return await propertyRepo.find({where:{isApproved:ApprovalStatus.APPROVED},
    relations: ["owner", "agent"],
    order: { createdAt: "DESC" },
  });
};

// delete property 

export const deletePropertyById = async (propertyId: number): Promise<boolean> => {

  const property = await propertyRepo.findOneBy({ id: propertyId });

  if (!property) return false;

  await propertyRepo.remove(property);
  return true;
};


// aprove or reject
export const updatePropertyApprovalStatus = async (
  propertyId: number,
  action: "approve" | "reject"
) => {
  const property = await propertyRepo.findOneBy({ id: propertyId });

  if (!property) {
    throw new Error("Property not found");
  }

  property.isApproved =action === "approve" ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;

  return await propertyRepo.save(property);
};


// update or edit property 
export const updateProperty = async (id: number, data: Partial<Property>) => {
  
  await propertyRepo.update({ id }, data);
  const updatedProperty = await propertyRepo.findOne({
     where: { id },
     relations: ["agent", "owner", "enquiries", "bookings"] 
   });
  return updatedProperty;
};