import { Router } from "express";
import { handleCreateEnquiry, handleGetEnquiriesByOwner, handleGetTenantEnquiries, handleReplyToEnquiry } from "../controllers/enquiry.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorizeRole";
import { BlockMiddleware } from "../middleware/BlockMiddleware";


const enquiryRouter = Router();

enquiryRouter.post("/createEnquiry",authenticate,authorizeRoles("tenant"),BlockMiddleware, handleCreateEnquiry);
enquiryRouter.get("/getEnquiryByTenant",authenticate,authorizeRoles("tenant"), handleGetTenantEnquiries);
enquiryRouter.get("/getEnquiryByOwner",authenticate,authorizeRoles("owner"), handleGetEnquiriesByOwner);
enquiryRouter.patch("/enquiry/reply/:id",authenticate,authorizeRoles("owner"),BlockMiddleware, handleReplyToEnquiry);
export default enquiryRouter;