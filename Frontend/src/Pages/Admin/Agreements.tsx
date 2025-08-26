import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getAllAgreements } from "../../Services/allApi";

interface Agreement {
  id: number;
  rentAmount: number;
  fixedDeposit: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  tenant: { id: number; name: string; email: string };
  owner: { id: number; name: string; email: string };
  property: {
    id: number;
    title: string;
    address: string;
    agent?: { id: number; name: string; email: string };
  };
}

const Agreements = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgreements = async () => {
    try {
      const res = await getAllAgreements();
      setAgreements(res.data);
    } catch (error) {
      console.error("Error fetching agreements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        All Agreements
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>Tenant</b>
            </TableCell>
            <TableCell>
              <b>Owner</b>
            </TableCell>
            <TableCell>
              <b>Property</b>
            </TableCell>
            <TableCell>
              <b>Agent</b>
            </TableCell>
            <TableCell>
              <b>Rent</b>
            </TableCell>
            <TableCell>
              <b>Deposit</b>
            </TableCell>
            <TableCell>
              <b>Start Date</b>
            </TableCell>
            <TableCell>
              <b>End Date</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agreements.map((agreement) => (
            <TableRow key={agreement.id}>
              <TableCell>{agreement.id}</TableCell>
              <TableCell>
                {agreement.tenant?.name} <br />({agreement.tenant?.email})
              </TableCell>
              <TableCell>
                {agreement.owner?.name}
                <br /> ({agreement.owner?.email})
              </TableCell>
              <TableCell>
                {agreement.property?.title}
                <br /> ({agreement.property?.address})
              </TableCell>
              <TableCell>
                {agreement.property?.agent ? (
                  <>
                    {agreement.property.agent.name} <br />
                    {agreement.property.agent.email}
                  </>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>₹{agreement.rentAmount}</TableCell>
              <TableCell>₹{agreement.fixedDeposit}</TableCell>
              <TableCell>
                {new Date(agreement.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(agreement.endDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Agreements;
