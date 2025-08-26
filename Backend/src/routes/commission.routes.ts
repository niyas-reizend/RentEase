import { Router } from "express";
import { handleGetAllCommissionsByAgentId } from "../controllers/agentCommission.controller";
import { authenticate } from "../middleware/authenticate";


const commissionRouter = Router();

// commissionRouter.post("/createCommission",handleCreateAgentCommission);

commissionRouter.get("/getCommissionByAgentId",authenticate,handleGetAllCommissionsByAgentId);
// commissionRouter.get("/:id",handleGetCommissionById);

export default commissionRouter;