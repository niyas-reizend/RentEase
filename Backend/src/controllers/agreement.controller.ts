import { Request, Response } from "express";
import { createAgreement, getAgreementById, getAgreementsByOwnerId, getAgreementsByTenantId, getAllAgreements } from "../services/agreement.service";



export const createAgreementController = async (req: Request, res: Response) => {
  try {
    const newAgreement = await createAgreement(req.body);
    return res.status(201).json(newAgreement);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};


// get all the agreement 
export const handleGetAllAgreements = async (req: Request, res: Response) => {
  try {
    const agreements = await getAllAgreements();
    res.json(agreements);
  } catch (error) {
    console.error("Error fetching agreements:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAgreementByIdController = async (req: Request, res: Response) => {
  try {
    const agreementId = parseInt(req.params.id);
    const agreement = await getAgreementById(agreementId);
    return res.json(agreement);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};
// Get agreements by tenantId
export const handleGetAgreementsByTenantId = async (req: any, res: Response) => {
  try {
    const tenantId = req.user.id
    const agreements = await getAgreementsByTenantId(tenantId);
    return res.status(200).json({
      agreements
    })
  } catch (err: any) {
    console.log(err)
  }
};

// Get agreements by ownerId
export const handleGetAgreementsByOwnerId = async (req: any, res: Response) => {
  try {
    const ownerId = req.user.id
    const agreements = await getAgreementsByOwnerId(ownerId);
    return res.json(agreements);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};