import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress
} from "@mui/material";
import { getTenantEnquiries } from "../../Services/allApi";

interface Property {
  id: number;
  title: string;
  address: string;
}

interface Enquiry {
  id: number;
  message: string;
  reply: string | null;
  createdAt: string;
  property: Property;
}

const MyEnquiry = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await getTenantEnquiries();
        setEnquiries(res.data.data); // backend returns { message, data }
      } catch (err) {
        console.error("Error fetching enquiries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        My Enquiries
      </Typography>

      {enquiries.length === 0 ? (
        <Typography>No enquiries found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="medium" aria-label="enquiries table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Property</strong></TableCell>
                <TableCell><strong>Message</strong></TableCell>
                <TableCell><strong>Reply</strong></TableCell>
                <TableCell><strong>Created At</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquiries.map((enquiry) => (
                <TableRow key={enquiry.id} hover>
                  <TableCell>{enquiry.property?.title}</TableCell>
                  <TableCell>{enquiry.message}</TableCell>
                  <TableCell>{enquiry.reply || "No reply yet"}</TableCell>
                  <TableCell>
                    {new Date(enquiry.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MyEnquiry;
