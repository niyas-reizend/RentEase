import { useEffect, useState } from "react";
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
import { getTenantAgreements } from "../../Services/allApi";
import { toast } from "react-toastify";
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
  agent: User;
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
const TenantAgreement = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(()=>{
  fetchAgreements()
},[])

const fetchAgreements = async() =>{
  setLoading(true)
  try{
    const res = await getTenantAgreements()
    console.log("Agreemnets",res.data)
    setAgreements(res.data.agreements)
  }catch(error){
    toast.error("Cannot fetch agreements")
    console.log('Error in fetching agreements',error)
  }finally {
      setLoading(false); 
}
}

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
          {agreements.length > 0 ? (
            agreements.map((agreement) => (
              <TableRow key={agreement.id}>
                <TableCell>{agreement.id}</TableCell>
                <TableCell>{agreement.startDate}</TableCell>
                <TableCell>{agreement.endDate}</TableCell>
                <TableCell>{agreement.property.title}</TableCell>
                <TableCell>{agreement.tenant.name}</TableCell>
                <TableCell>{agreement.owner.name}</TableCell>
                <TableCell>{agreement.property.agent?.name || "N/A"}</TableCell>
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
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                align="center"
                sx={{ py: 3, fontWeight: "bold", color: "text.secondary" }}
              >
                No agreements found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TenantAgreement;
