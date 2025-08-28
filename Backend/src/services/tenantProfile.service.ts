import dataSource from "../database/datasource";
import { TenantProfile } from "../entities/TenantProfile";
import { User } from "../entities/User";



const tenantProfileRepo = dataSource.getRepository(TenantProfile);
const userRepo = dataSource.getRepository(User);

// create tenant profile 
export const createTenantProfile = async (userId: number, identityDocumentUrl: string) => {
  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new Error("User not found");
  if(user.role !== "tenant") throw new Error ("User is not a tenant ");

  const profile = tenantProfileRepo.create({
    user,
    identityDocumentUrl,
    isVerified: false
  });

  return await tenantProfileRepo.save(profile);
};

// get all tenants  

export const getAllTenants = async () => {

    const tenants = await tenantProfileRepo.find({
      relations: ["user"],
      order:{user:{id:'ASC'}} // include User details
    });
    console.log("Tenants from controller",tenants)
    return tenants;

};



// to get tenant profile by user id 
export const getTenantProfileByUserId = async (tenantId:number) => {

    const profile = await tenantProfileRepo.findOne({
      where: { user: { id: tenantId }},
      relations: ["user"]
    });
     
    return profile 
};

// to verify the tenant by admin 
export const verifyTenantProfile = async (userId: number, isVerified: boolean) => {
  // find profile by user relation
  const profile = await tenantProfileRepo.findOne({
    where: { user: { id: userId } },
    relations: ["user"],
  });

  if (!profile) throw new Error("Tenant profile not found");

  profile.isVerified = isVerified;

  return await tenantProfileRepo.save(profile);
};