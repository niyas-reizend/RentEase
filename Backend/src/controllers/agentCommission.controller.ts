
import { Request, Response } from "express";
import { getAllCommissionsByAgentId, getCommissionById } from "../services/agentCommission.service";


export const handleGetAllCommissionsByAgentId = async (req: any, res: Response) => {
  try {
    const agentId = req.user.id
  
    const commissions = await getAllCommissionsByAgentId(agentId);
    res.json(commissions);
  } catch (err) {
    res.status(500).json({ error: " totally failed Failed to fetch commissions" });
  }
};

// export const handleGetCommissionById = async (req: Request, res: Response) => {
//   try {
//     const id = Number(req.params.id);
//     const commission = await getCommissionById(id);
//     res.json(commission);
//   } catch (err: any) {
//     res.status(404).json({ error: err.message });
//   }
// };
