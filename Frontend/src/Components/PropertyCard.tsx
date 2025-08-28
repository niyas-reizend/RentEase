// components/PropertyCard.tsx
import { Card, CardMedia, CardContent, Typography, Box, Chip,Button, IconButton, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


interface PropertyCardProps {
  title: string;
  city: string;
  state: string;
  rentAmount: number;
  fixedDepositAmount: number;
  image: string[];
  amenities: string[];
  propertyId: number;
  onViewDetails: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onEnquiry?:()=> void;
  onBooking?:()=> void;
  mode?:"tenant" | "agent" |"admin";

}

export default function PropertyCard({
  title,
  city,
  state,
  rentAmount,
  fixedDepositAmount,
  image,
  amenities,
  onViewDetails,
  onApprove,
  onReject,
  onEnquiry,
  onBooking,
  mode
}: PropertyCardProps) {
  const [open,setOpen] = useState(false);
  const handleOpen =()=>setOpen(true);
  const handleClose =()=>setOpen(false);


  return (
    <>
 
  <Card sx={{maxHeight:600, maxWidth: 345, borderRadius: 2, boxShadow: 3, display: "flex", flexDirection: "column" ,border:"1px solid cyan"}}>
    {/* Thumbnail image  */}

  <CardMedia
    component="img"
    height="250"
    image={image[0]}
    alt={title}
    onClick={handleOpen}
    sx={{cursor:"pointer"}}
  />
  <CardContent sx={{minHeight:200}}>
    <Typography variant="h6" fontWeight="bold">
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {city}, {state}
    </Typography>
    <Typography variant="body1" mt={1}>
      Rent: ₹{rentAmount.toLocaleString()}
    </Typography>
    <Typography variant="body1">
      Deposit: ₹{fixedDepositAmount.toLocaleString()}
    </Typography>

    <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
      {amenities.slice(0, 3).map((amenity, idx) => (
        <Chip key={idx} label={amenity} size="small" />
      ))}
    </Box>
  </CardContent>
      {/* Buttons Section */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", p: 2, pt: 0 }}
      >
        <Button variant="outlined" size="small" onClick={onViewDetails}>
          View Details
        </Button>

        {/* Tenant Buttons */}
        {mode === "tenant" && (
          <Button variant="contained" size="small" onClick={onEnquiry}>
            Enquiry
          </Button>
        )}

        {/* Admin Buttons */}
        {mode === "admin" && (
          <>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={onApprove}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={onReject}
            >
              Reject
            </Button>
          </>
        )}
      </Box>

      {/* Tenant Booking */}
      {mode === "tenant" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            pt: 2,
            borderTop: "1px solid cyan",
          }}
        >
          <Button variant="outlined" size="small" onClick={onBooking}>
            Book Property
          </Button>
        </Box>
  )}
</Card>

{/* Modal with Carousel  */}

<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
  <IconButton
  onClick={handleClose}
  sx={{position:"absolute", right:8,top:8 ,zIndex:2, border:"1px solid white" ,backgroundColor:"lightgrey",color:"white"}}
  >
    < CloseIcon  sx={{fontSize:"40px"}}/>
  </IconButton>
  <DialogContent>
  <Carousel
    autoPlay
    infiniteLoop
    showThumbs={false}
    showStatus={false}
    interval={2000}   // autoplay speed
    swipeable
    emulateTouch
    dynamicHeight={false} // ✅ prevents shaking
  >
    {image?.map((img, index) => (
      <div key={index}>
        <img
          src={img}
          alt={`Property images ${index + 1}`}
          style={{
            width: "100%",
            height: "500px",     
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </div>
    ))}
  </Carousel>
</DialogContent>

</Dialog>
</>
  );
}
