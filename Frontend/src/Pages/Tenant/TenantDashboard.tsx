// pages/TenantDashboard.tsx
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
} from "@mui/material";
// import PropertyCard from "../components/PropertyCard";
import { bookProperty, fetchpropertyfortenant, sendEnquiry } from "../../Services/allApi";
import PropertyCard from "../../Components/PropertyCard";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function TenantDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [enquiryText, setEnquiryText] = useState("");
  const [openEnquiry, setOpenEnquiry] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  // const [bookingProperty, setBookingProperty] = useState(null);
  const {user,logout} = useAuth();


  // Tenant-proposed values
  const [bookingFormData, setBookingFormData] = useState({
  propertyId: "",
  tenantId: user?.id || null,
  rentAmount: "",
  fixedDeposit: "",
  agreementStartDate: Date,
  agreementEndDate: Date,
});




  const propertyfortenant = async () => {
    try {
      const res = await fetchpropertyfortenant();
      setProperties(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    propertyfortenant();
  }, []);

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setOpen(true);
  };

  const handleDetailClose = () => {
    setOpen(false);
    setSelectedProperty(null);
  };

  const handleEnquiry = (property: any) => {
    setSelectedProperty(property);
    setOpenEnquiry(true);
  };
  const handleSendEnquiry = async () => {
    console.log(`Enquiry for property ${selectedProperty.id}:`, enquiryText);
    const data = {
      propertyId: selectedProperty.id,
      message: enquiryText,
    };
    await sendEnquiry(data);
    toast.success("Enquiry Send ")

    setOpenEnquiry(false);
    setEnquiryText("");
  };
//   const handleBookingChange = (field: keyof typeof bookingFormData, value: string) => {
//   setBookingFormData(prev => ({
//     ...prev,
//     [field]: value
//   }));
// };

const handleBookingChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setBookingFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};


// function for  the booking  
const handleOpenBooking =(property: any)=>{
  setSelectedProperty(property)
  setOpenBooking(true)
}

const handleBooking=async()=>{
  try{
    const payload = {
      ...bookingFormData,
      tenantId:user?.id,
      propertyId:selectedProperty?.id
    };
    console.log(payload);
    
      await bookProperty(payload); 
      toast.success("Booking Successfull.")
      setOpenBooking(false);

  }catch (err: any) {
  if (err.response) {
    if (err.response.status === 403) {
      // Blocked user
      alert(err.response.data.error); 
      logout();
      // navigate("/blocked"); // redirect to a Blocked page
    } else if (err.response.status === 401) {
      alert("User not found. Please log in again.");
      // logout();
      // navigate("/login");
    } else {
      alert("Error: " + err.response.data.error);
    }
  } else {
    console.error("Network or server error", err.message);
  }
}
}

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Available Properties
      </Typography>
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg:3 }} key={property.id}>
            <PropertyCard
              title={property.title}
              city={property.city}
              state={property.state}
              propertyId={property.id}
              rentAmount={property.rentAmount}
              fixedDepositAmount={property.fixedDepositAmount}
              image={property.images.map((img: string) => `http://localhost:5100${img}`)}    
              amenities={property.amenities}
              onViewDetails={() => handleViewDetails(property)}
              onEnquiry={() => handleEnquiry(property)}
              onBooking={() => handleOpenBooking(property)}
              mode="tenant"
            />
          </Grid>
        ))}
      </Grid>

      {/* Details Dialog */}
<Dialog open={open} onClose={handleDetailClose} maxWidth="md" fullWidth>
{selectedProperty && ( 
    <>
      <DialogTitle>{selectedProperty.title}</DialogTitle>
      <DialogContent sx={{ display: "flex", gap: 3 }}>
        {/* Left Side - Image */}
        <Box sx={{ flex: "0 0 45%" }}>
          <img
            src={`http://localhost:5100${selectedProperty.images[0]}`}
            alt={selectedProperty.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Right Side - Details */}
        <Box sx={{ flex: 1 }}>
          <Typography mb={1}>
            <strong>City:</strong> {selectedProperty.city}
          </Typography>
          <Typography mb={1}>
            <strong>State:</strong> {selectedProperty.state}
          </Typography>
          <Typography mb={1}>
            <strong>Rent:</strong> ₹{selectedProperty.rentAmount.toLocaleString()}
          </Typography>
          <Typography mb={1}>
            <strong>Deposit:</strong> ₹
            {selectedProperty.fixedDepositAmount.toLocaleString()}
          </Typography>
          <Typography mb={1}>
            <strong>Description:</strong> {selectedProperty.description}
          </Typography>
          <Typography mb={1}>
            <strong>Owner:</strong> {selectedProperty.owner.name}
          </Typography>
          <Typography mb={1}>
            <strong>Owner Contact:</strong> {selectedProperty.owner.email}
          </Typography>
          <Typography mb={1}>
            <strong>Agent:</strong> {selectedProperty.agent.name}
          </Typography>
          <Typography mb={1}>
            <strong>Agent Contact:</strong> {selectedProperty.agent.email}
          </Typography>

          <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
            {selectedProperty.amenities.map(
              (amenity: string, idx: number) => (
                <Chip key={idx} label={amenity} size="small" />
              )
            )}
          </Box>
        </Box>
      </DialogContent>
    </>
  )}
</Dialog>

      {/* Enquiry Dialog */}
      <Dialog
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Ask Your Enquiry</DialogTitle>

        <DialogContent>
          <Typography>
            <strong>Enquiry about:</strong> {selectedProperty?.title}
          </Typography>

          <TextField
            label="Your enquiry"
            placeholder="Type your question here..."
            multiline
            rows={4}
            value={enquiryText}
            onChange={(e) => setEnquiryText(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEnquiry(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendEnquiry}
            disabled={!enquiryText.trim()}
          >
            Send Enquiry
          </Button>
        </DialogActions>
      </Dialog>

      {/* booking dialogue */}
<Dialog open={openBooking} onClose={() => setOpenBooking(false)} fullWidth maxWidth="sm">
  {selectedProperty && (
    <>
      <DialogTitle>Book {selectedProperty.title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid size={{xs:6}}>
            <TextField
              label="Proposed Rent Amount"
              name="rentAmount"
              placeholder="enter in number"
              value={bookingFormData.rentAmount}
              onChange={ handleBookingChange}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid size={{xs:6}}>
            <TextField
              label="Proposed Fixed Deposit"
              name="fixedDeposit"
              value={bookingFormData.fixedDeposit }
              onChange={ handleBookingChange}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid size={{xs:6}}>
            <TextField
              label="Agreement Start Date"
              name="agreementStartDate"
              value={bookingFormData.agreementStartDate }
              onChange={ handleBookingChange}
              type="date"
              fullWidth
              slotProps={{inputLabel:{shrink:true}}}
            />
          </Grid>
          <Grid size={{xs:6}} >
            <TextField
              label="Agreement End Date"
              name="agreementEndDate"
              value={bookingFormData.agreementEndDate}
              onChange={handleBookingChange}
              type="date"
              fullWidth
              slotProps={{inputLabel:{shrink:true}}}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenBooking(false)} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleBooking}
          disabled={
            !bookingFormData.rentAmount ||
            !bookingFormData.fixedDeposit ||
            !bookingFormData.agreementStartDate ||
            !bookingFormData.agreementEndDate
          }
        >
          Book Property
        </Button>
      </DialogActions>
    </>
  )}
</Dialog>
</>
  );
}


