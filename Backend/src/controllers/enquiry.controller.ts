// controllers/EnquiryController.ts
import { Request, Response } from "express";
import { createEnquiry, getEnquiriesByOwner, getEnquiriesByTenant, replyToEnquiry } from "../services/enquiry.service";


// create enquiry
export const handleCreateEnquiry = async (req: any, res: Response) => {
  try {
    const tenantId = req.user.id
    const { propertyId, message } = req.body;

    const enquiry = await createEnquiry({ tenantId, propertyId, message });
    return res.status(201).json({
      message: "Enquiry created successfully",
      data: enquiry,
    });
  } catch (err) {
    console.error("Error creating enquiry:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// get enquiry by tenant id 
export const handleGetTenantEnquiries = async (req: any, res: Response) => {
  try {
    const tenantId = req.user.id; // from auth middleware
    const enquiries = await getEnquiriesByTenant(tenantId);

    return res.status(200).json({
      message: "Enquiries fetched successfully",
      data: enquiries,
    });
  } catch (err: any) {
    console.error("Error fetching enquiries:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// get enquiry by owner ID 
export const handleGetEnquiriesByOwner = async (req: any, res: Response) => {
  try {
    const ownerId = req.user.id;

    const enquiries = await getEnquiriesByOwner(ownerId);

    res.status(200).json(enquiries);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error fetching enquiries" });
  }
};

// reply to Enquiry 
export const handleReplyToEnquiry = async (req: Request, res: Response) => {
  console.log("APi calllllllllllll")
  try {
    const enquiryId = parseInt(req.params.id);
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const updatedEnquiry = await replyToEnquiry(enquiryId, reply);
    res.status(200).json(updatedEnquiry);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

