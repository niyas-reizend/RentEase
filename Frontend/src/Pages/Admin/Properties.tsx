import { CircularProgress, Typography, Grid, Dialog, DialogTitle, DialogContent, Box, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import PropertyCard from "../../Components/PropertyCard";
import { fetchpropertyfortenant } from "../../Services/allApi";


const Properties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);


  const propertyfortenant = async () => {
    try {
      const res = await fetchpropertyfortenant();
    //   console.log(res.data);
      setProperties(res.data);
    //   console.log(properties);
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


 if (loading) return <CircularProgress />;




  return (

    <>
      <Typography variant="h4" gutterBottom>
        Available Properties
      </Typography>
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
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
    </>
  )
}

export default Properties