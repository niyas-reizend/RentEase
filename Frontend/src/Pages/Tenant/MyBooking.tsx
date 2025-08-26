import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress
} from "@mui/material";
import { getTenantBooking } from "../../Services/allApi";
import { useAuth } from "../../context/AuthContext";

interface Property {
  id: number;
  title: string;
  address: string;
}

type BookingStatus = "PENDING" | "APPROVED" | "REJECTED";

interface Booking {
  id: number;
  rentAmount: number;
  fixedDeposit: number;
  status: BookingStatus;
  bookingDate: string;
  agreementStartDate: string | null;
  agreementEndDate: string | null;
  property: Property;
}

const MyBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user }: any = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getTenantBooking();
        console.log(res.data);
        
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?.id]);

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
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Typography>No bookings found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="medium" aria-label="bookings table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Property</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Rent (₹)</strong></TableCell>
                <TableCell><strong>Deposit (₹)</strong></TableCell>
                <TableCell><strong>Booking Date</strong></TableCell>
                <TableCell><strong>Agreement</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>{booking.property?.title}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>{booking.rentAmount}</TableCell>
                  <TableCell>{booking.fixedDeposit}</TableCell>
                  <TableCell>
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {booking.agreementStartDate
                      ? `${booking.agreementStartDate} → ${booking.agreementEndDate}`
                      : "Not yet signed"}
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

export default MyBooking;





// import { useEffect, useState } from "react";
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Typography,
//   CircularProgress, Button, Dialog, DialogTitle,
//   DialogContent, DialogActions
// } from "@mui/material";
// import { getTenantBooking } from "../../Services/allApi";
// import { getAgreementByBooking } from "../../Services/agreementApi";
// import { jsPDF } from "jspdf";
// import { useAuth } from "../../context/AuthContext";

// interface Property {
//   id: number;
//   title: string;
//   address: string;
// }

// type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CREATED";

// interface Booking {
//   id: number;
//   rentAmount: number;
//   fixedDeposit: number;
//   status: BookingStatus;
//   bookingDate: string;
//   agreementStartDate: string | null;
//   agreementEndDate: string | null;
//   property: Property;
// }

// interface Agreement {
//   id: number;
//   rentAmount: number;
//   fixedDeposit: number;
//   startDate: string;
//   endDate: string;
//   tenant: { name: string; email: string };
//   owner: { name: string; email: string };
//   property: { title: string; address: string };
// }

// const MyBooking = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
//   const [open, setOpen] = useState(false);
//   const { user }: any = useAuth();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await getTenantBooking();
//         setBookings(res.data.data); // ✅ backend returns { message, data }
//       } catch (err) {
//         console.error("Error fetching bookings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();
//   }, [user?.id]);

//   const handleViewAgreement = async (bookingId: number) => {
//     try {
//       const res = await getAgreementByBooking(bookingId);
//       setSelectedAgreement(res.data.data);
//       setOpen(true);
//     } catch (err) {
//       console.error("Error fetching agreement:", err);
//     }
//   };

//   const handleDownloadPDF = () => {
//     if (!selectedAgreement) return;

//     const doc = new jsPDF();
//     doc.setFontSize(14);
//     doc.text("Rental Agreement", 20, 20);
//     doc.text(`Tenant: ${selectedAgreement.tenant.name} (${selectedAgreement.tenant.email})`, 20, 40);
//     doc.text(`Owner: ${selectedAgreement.owner.name} (${selectedAgreement.owner.email})`, 20, 50);
//     doc.text(`Property: ${selectedAgreement.property.title}, ${selectedAgreement.property.address}`, 20, 60);
//     doc.text(`Rent: ₹${selectedAgreement.rentAmount}`, 20, 80);
//     doc.text(`Deposit: ₹${selectedAgreement.fixedDeposit}`, 20, 90);
//     doc.text(`Agreement Period: ${selectedAgreement.startDate} → ${selectedAgreement.endDate}`, 20, 110);
//     doc.save("agreement.pdf");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-10">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Typography variant="h5" gutterBottom>
//         My Bookings
//       </Typography>

//       {bookings.length === 0 ? (
//         <Typography>No bookings found.</Typography>
//       ) : (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table size="medium" aria-label="bookings table" stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell><strong>Property</strong></TableCell>
//                 <TableCell><strong>Status</strong></TableCell>
//                 <TableCell><strong>Rent (₹)</strong></TableCell>
//                 <TableCell><strong>Deposit (₹)</strong></TableCell>
//                 <TableCell><strong>Booking Date</strong></TableCell>
//                 <TableCell><strong>Agreement</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bookings.map((booking) => (
//                 <TableRow key={booking.id} hover>
//                   <TableCell>{booking.property?.title}</TableCell>
//                   <TableCell>{booking.status}</TableCell>
//                   <TableCell>{booking.rentAmount}</TableCell>
//                   <TableCell>{booking.fixedDeposit}</TableCell>
//                   <TableCell>
//                     {new Date(booking.bookingDate).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>
//                     {booking.status === "CREATED" && booking.agreementStartDate ? (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => handleViewAgreement(booking.id)}
//                       >
//                         View
//                       </Button>
//                     ) : (
//                       "Not yet signed"
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Agreement Modal */}
//       <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Agreement</DialogTitle>
//         <DialogContent dividers>
//           {selectedAgreement ? (
//             <>
//               <Typography><strong>Tenant:</strong> {selectedAgreement.tenant.name}</Typography>
//               <Typography><strong>Owner:</strong> {selectedAgreement.owner.name}</Typography>
//               <Typography><strong>Property:</strong> {selectedAgreement.property.title}</Typography>
//               <Typography><strong>Address:</strong> {selectedAgreement.property.address}</Typography>
//               <Typography><strong>Rent:</strong> ₹{selectedAgreement.rentAmount}</Typography>
//               <Typography><strong>Deposit:</strong> ₹{selectedAgreement.fixedDeposit}</Typography>
//               <Typography><strong>Agreement Period:</strong> {selectedAgreement.startDate} → {selectedAgreement.endDate}</Typography>
//             </>
//           ) : (
//             <Typography>No agreement found</Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Close</Button>
//           <Button onClick={handleDownloadPDF} variant="contained" color="primary">
//             Download PDF
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default MyBooking;

