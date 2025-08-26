import { Request, Response } from "express";
import { addProperty,  deletePropertyById, getAllProperties, getAllPropertiesForTenants, getPropertiesByAgent, getPropertiesByOwner, getPropertyById, getUnverifiedProperties, updateProperty, updatePropertyApprovalStatus } from "../services/property.service";
import dataSource from "../database/datasource";


// get all property 
export const handleGetAllProperties = async (_req: Request, res: Response) => {
  try {
    const properties = await getAllProperties();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// get all the unverified properties 
export const handleGetUnverifiedProperties = async (_req: Request, res: Response) => {
  try {
    const properties = await getUnverifiedProperties();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching unverified properties:", error);
    res.status(500).json({ message: "Failed to fetch unverified properties" });
  }
};

// get property by property id 
export const getPropertyByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await getPropertyById(id);
    return res.status(200).json(property);
  } catch (error: any) {
    if (error.message === "Property not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



// get all verified properties for  tenants and admin
export const handleGetAllPropertiesForTenants = async (_req: Request, res: Response) => {
  try {
    const properties = await getAllPropertiesForTenants();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};
// get properties by owner id 
export const getOwnerPropertiesController = async (req: any, res: Response) => {
  try {
    const ownerId = req.user.id;
    if (!ownerId) {
      return res.status(400).json({ success: false, message: "Owner ID is required" });
    }

    const properties = await getPropertiesByOwner(ownerId);
    return res.json({ success: true, data: properties });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch properties" });
  }
};

// get property by Agent id 
export const getAgentPropertiesController = async (req: any, res: Response) => {
  try {
    const agentId = req.user.id;
    if (!agentId) {
      return res.status(400).json({ success: false, message: "Agent ID is required" });
    }

    const properties = await getPropertiesByAgent(agentId);
    return res.json({ success: true, data: properties });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch properties" });
  }
};





// delete property 
export const handleDeleteProperty = async (req: Request, res: Response) => {
  const propertyId = parseInt(req.params.id);

  if (isNaN(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const result = await deletePropertyById(propertyId);
    if (!result) {
      return res.status(404).json({ message: "Property not found" });
    }
    return res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error deleting property:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// approve reject property 
export const handleApproveProperty = async (req: Request, res: Response) => {
  const { propertyId, action } = req.body; // expects "approve" or "reject"

  try {
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const updatedProperty = await updatePropertyApprovalStatus(propertyId, action as "approve" | "reject");

    res.json({
      message: `Property ${action}d successfully`,
      property: updatedProperty,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
};


// add or create property 
export const handleAddProperty = async (req: any, res: Response) => {
  try {
     const userId = req.user.id
  console.log("User id in controller",userId)
  console.log(  "uploaded images--------" ,req.files);
  
    // Get image file paths from multer
    const images = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
    const amenities=req.body.amenities? JSON.parse(req.body.amenities): [];
    // Merge body data with image paths
    const propertyData = {
      ...req.body,
      amenities,
      rentAmount: Number(req.body.rentAmount),
      fixedDepositAmount: Number(req.body.fixedDepositAmount),
      ownerId: Number(req.user.id),
      agentId: req.body.agentId,
      images
    };

    const property = await addProperty(propertyData);
    res.status(201).json({ message: "Property added successfully", property });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


// edit or update property 
export const updatePropertyController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
        let updateData = { ...req.body };

    // Parse amenities JSON string from FormData
    if (updateData.amenities) {
      updateData.amenities = JSON.parse(updateData.amenities);
    }

    const updatedProperty = await updateProperty(id, updateData);

    // const updatedProperty = await updateProperty(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      updatedProperty
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update property"
    });
  }
};