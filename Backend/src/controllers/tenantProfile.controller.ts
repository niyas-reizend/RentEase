import { Request,Response } from "express";
import { createTenantProfile, getAllTenants, getTenantProfileByUserId, verifyTenantProfile } from "../services/tenantProfile.service";

// create tenant profile 
export const handleCreateTenantProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    if (!req.file) throw new Error("Identity document is required");

    const identityDocumentUrl = `/uploads/${req.file.filename}`;
    const profile = await createTenantProfile(userId, identityDocumentUrl);

    res.status(201).json({ message: "Tenant profile created", profile });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


// get all tenants 

export const handleGetAllTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await getAllTenants();
    res.json(tenants);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch tenants" });
  }
};

// to get tenant profile by user id 
export const getTenantProfile = async (req: any, res: Response) => {
  try {
    const tenantId = req.user.id
    const result = await getTenantProfileByUserId(tenantId)

    if (!result) return res.status(404).json({ message: "Profile not found" });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


// to verify the tenant profile by the admin 
export const handleVerifyTenantProfile = async (req: Request, res: Response) => {
  try {
    const { userId, isVerified } = req.body;

    const profile = await verifyTenantProfile(userId, isVerified);

    res.json({ message: "Tenant profile updated", profile });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};