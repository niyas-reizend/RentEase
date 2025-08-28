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


