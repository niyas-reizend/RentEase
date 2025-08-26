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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getTenantAgreements } from "../../Services/allApi";
import { toast } from "react-toastify";
// import { getOwnerAgreements } from "../../Services/allApi";
// import { useAuth } from "../../context/AuthContext";
// import type { InfoRounded } from "@mui/icons-material";

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

  const downloadPDF = (agreement: Agreement) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Rental Agreement", 14, 20);

    doc.setFontSize(12);
    doc.text(`Agreement ID: ${agreement.id}`, 14, 30);
    doc.text(`Start Date: ${agreement.startDate}`, 14, 40);
    doc.text(`End Date: ${agreement.endDate}`, 14, 50);

    // Agreement financials
    autoTable(doc, {
      startY: 60,
      head: [["Rent Amount", "Fixed Deposit"]],
      body: [[agreement.rentAmount, agreement.fixedDeposit]],
    });

    // Parties involved
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Role", "Name", "Email"]],
      body: [
        ["Owner", agreement.owner.name, agreement.owner.email],
        ["Tenant", agreement.tenant.name, agreement.tenant.email],
        agreement.property.agent.name
          ? [
              "Agent",
              agreement.property.agent.name,
              agreement.property.agent.email,
            ]
          : [],
      ].filter((row) => row.length > 0),
    });

    // Property details
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Property Title", "Location"]],
      body: [[agreement.property.title, agreement.property.city]],
    });

    doc.save(`Agreement_${agreement.id}.pdf`);
  };

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
