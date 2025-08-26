import { Router } from "express";
import { getAgentPropertiesController, getOwnerPropertiesController, getPropertyByIdController, handleAddProperty, handleApproveProperty, handleDeleteProperty, handleGetAllProperties, handleGetAllPropertiesForTenants, handleGetUnverifiedProperties, updatePropertyController } from "../controllers/property.controller";
import { upload } from "../utils/multer";
import { authenticate } from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorizeRole";
import { BlockMiddleware } from "../middleware/BlockMiddleware";


const propertyRouter = Router();

propertyRouter.get("/getallproperty",authenticate,authorizeRoles("admin"),handleGetAllProperties);
propertyRouter.get("/getAllUnverifiedProperties",authenticate,authorizeRoles("admin"),handleGetUnverifiedProperties)
propertyRouter.get("/getallpropertyfortenants",authenticate,authorizeRoles("tenant","admin"),handleGetAllPropertiesForTenants);//for tenants
propertyRouter.get("/property/:id", getPropertyByIdController);
propertyRouter.delete("/property/:id",authenticate,authorizeRoles("owner"),BlockMiddleware,handleDeleteProperty);
propertyRouter.put("/propertyApproval",authenticate,authorizeRoles("admin"),handleApproveProperty);
propertyRouter.get("/getPropertiesByOwnerId",authenticate,getOwnerPropertiesController)
propertyRouter.post("/add-property", authenticate,authorizeRoles('owner'),upload.array("images", 5),BlockMiddleware, handleAddProperty);
propertyRouter.put('/update/:id', upload.none(),authenticate,BlockMiddleware, updatePropertyController);
propertyRouter.get("/getPropertiesByAgentId",authenticate,authorizeRoles("agent"),getAgentPropertiesController);


export default propertyRouter;
