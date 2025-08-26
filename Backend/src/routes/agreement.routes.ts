import { Router } from "express";
import {
  createAgreementController,
  getAgreementByIdController,
  handleGetAgreementsByOwnerId,
  handleGetAgreementsByTenantId,
  handleGetAllAgreements,
} from "../controllers/agreement.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorizeRole";
import { BlockMiddleware } from "../middleware/BlockMiddleware";

const agreementRouter = Router();
// agreementRouter.post("/createAgreement", createAgreementController);
agreementRouter.get("/getallagreements",authenticate ,handleGetAllAgreements);
agreementRouter.get("/agreement/:id",authenticate ,getAgreementByIdController);
agreementRouter.get("/tenantAgreements",authenticate,BlockMiddleware,handleGetAgreementsByTenantId);
agreementRouter.get("/ownerAgreements",authenticate,authorizeRoles("owner"),handleGetAgreementsByOwnerId)

export default agreementRouter;
