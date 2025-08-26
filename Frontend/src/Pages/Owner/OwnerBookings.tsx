import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Chip
} from "@mui/material";
import { getOwnerBookings, updateBookingStatus } from "../../Services/allApi";
import { toast } from "react-toastify";


export default function OwnerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  // const [error,setError] = useState("")
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getOwnerBookings();
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };
    fetchBookings();
  }, [bookings]);

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    const payload = {bookingId:bookingId,status:status}
    try {
      const res = await updateBookingStatus(payload);
      console.log(res);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: status } : booking
        ));
        if(status=="confirmed"){
          toast.success("Booking Confirmed")
        }
        else if(status =="rejected"){
          toast.success("Booking Rejected")
        }
    } catch (err:any) {
      console.error("Error updating booking status", err);
      // console.log();
      if (err.data && err.data.error){
        toast.error(err.data.error);
      }
      else{
        toast.error("Something went wrong .please try Again")
      }
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "pending":
        return <Chip label="Pending" color="warning" />;
      case "confirmed":
        return <Chip label="Confirmed" color="success" />;
      case "rejected":
        return <Chip label="Rejected" color="error" />;
      case "agreement_created":
        return <Chip label="Agreement Created" color="info" />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Bookings on Your Properties
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Rent</TableCell>
              <TableCell>Deposit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>StartDate</TableCell>
              <TableCell>EndDate</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.property?.title}</TableCell>
                <TableCell>{booking.tenant?.name}</TableCell>
                <TableCell>₹{booking.rentAmount}</TableCell>
                <TableCell>₹{booking.fixedDeposit}</TableCell>
                <TableCell>{getStatusChip(booking.status)}</TableCell>
                <TableCell>
                  {new Date(booking.agreementStartDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.agreementEndDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {booking.status === "pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() =>
                          handleUpdateStatus(booking.id, "confirmed")
                        }
                        style={{ marginRight: 8 }}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          handleUpdateStatus(booking.id, "rejected")
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
