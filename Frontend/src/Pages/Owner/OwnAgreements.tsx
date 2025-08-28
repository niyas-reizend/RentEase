import  { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getOwnerAgreements } from "../../Services/allApi";
import downloadPDF from "../../Utils/downloadPDF";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Property {
  id: number;
  title: string;
  city: string;
  agent:User;
}

interface Agreement {
  id: number;
  startDate: string;
  endDate: string;
  rentAmount: string;
  fixedDeposit: string;
  property: Property;
  owner: User;
  tenant: User;
}

// const Agreements: React.FC<{ ownerId: number }> = ({ ownerId }) => {
const OwnAgreements = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const res = await getOwnerAgreements();
        setAgreements(res.data);
        console.log(res.data);
      } catch (err:any) {
        console.log("Error in fetching Agreements",err)
      } finally {
        setLoading(false);
      }
    };
    fetchAgreements();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ m: 2 }}>
        Agreements
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Agreement ID</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Property</TableCell>
            <TableCell>Tenant</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Agent</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {agreements.map((agreement) => (
            <TableRow key={agreement.id}>
              <TableCell>{agreement.id}</TableCell>
              <TableCell>{agreement.startDate}</TableCell>
              <TableCell>{agreement.endDate}</TableCell>
              <TableCell>{agreement.property.title}</TableCell>
              <TableCell>{agreement.tenant.name}</TableCell>
              <TableCell>{agreement.owner.name}</TableCell>
              <TableCell>
                {agreement.property.agent?.name || "N/A" }
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => downloadPDF(agreement)}
                >
                  Download PDF
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OwnAgreements;
