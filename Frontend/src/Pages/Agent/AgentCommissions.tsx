import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";
import { getAgentCommissionsByAgentId } from "../../Services/allApi";

interface Agent {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Property {
  id: number;
  title: string;
  address: string;
  owner:User;
}

interface Commission {
  id: number;
  commissionAmount: number;
  createdAt: string;
  agent: Agent;
  property: Property;
}

const AgentCommissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const res = await getAgentCommissionsByAgentId();
        setCommissions(res.data);
      } catch (err) {
        console.error("Error fetching commissions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <> 
    <Typography variant="h5" gutterBottom> All Commissions</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Property</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Commission Amount</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commissions.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.property?.title} ({c.property?.address})</TableCell>
              <TableCell>{c.property?.owner?.name} </TableCell>
              <TableCell>₹{c.commissionAmount}</TableCell>
              <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default AgentCommissions;
