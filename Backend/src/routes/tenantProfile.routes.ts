import { Router } from "express";
import { uploadDocument } from "../utils/multer";
import { getTenantProfile, handleCreateTenantProfile, handleGetAllTenants, handleVerifyTenantProfile } from "../controllers/tenantProfile.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorizeRole";

const tenantProfileRouter = Router();

tenantProfileRouter.post("/createProfile",authenticate,authorizeRoles("tenant"), uploadDocument.single("identityDocumentUrl"), handleCreateTenantProfile);
tenantProfileRouter.patch("/verifyTenants",authenticate,authorizeRoles("admin"), handleVerifyTenantProfile);

tenantProfileRouter.get("/getalltenants", authenticate,authorizeRoles("admin"),handleGetAllTenants);
tenantProfileRouter.get("/tenantProfilebyid", authenticate,authorizeRoles("tenant"),getTenantProfile);
// tenantProfileRouter.delete("/:id", handleDeleteTenantProfile);

export default tenantProfileRouter;