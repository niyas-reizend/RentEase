// pages/AdminPropertyApprovalPage.tsx
import  { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import PropertyCard from "../../Components/PropertyCard";
import { approveProperties, getUnverifiedProperties } from "../../Services/allApi";
import { toast } from "react-toastify";


interface Property {
  id: number;
  title: string;
  city: string;
  state: string;
  rentAmount: number;
  fixedDepositAmount: number;
  description: string;
  amenities: string[];
  isApproved: boolean;
  images: string[];
  owner: { id: number; name: string; email: string };
  agent: { id: number; name: string; email: string };
}

const VerifyProperty = ()=> {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnverifiedProperties();
  }, []);

  const fetchUnverifiedProperties = async () => {
    try {
      const res = await getUnverifiedProperties();
      setProperties(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching properties", err);
      setLoading(false);
    }
  };

  const handleApprovalAction = async (propertyId: number,action:"approve"|"reject") => {
    try {
        const payload = {
            propertyId:propertyId,
            action:action
        }
      await approveProperties(payload)
      if(action==="approve"){
        toast.success("Property Approved Successfully")
      }
      if(action==="reject"){
        toast.success("Property Rejected")
      }
      fetchUnverifiedProperties(); // refresh list
      setOpen(false); // close modal if open
    } catch (err) {
      console.error(`Error ${action} property`, err);
      toast.error(`Error ${action} property failed`)
    }
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setOpen(true);
  };

  const handleDetailClose = () => {
    setOpen(false);
    setSelectedProperty(null);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Unverified Properties
      </Typography>

      <Grid container spacing={3}>
        {properties.length > 0 ? (
          properties.map((property) => (
            <Grid size={{xs:12,sm:6,md:4}} key={property.id}>
              <PropertyCard
                title={property.title}
                city={property.city}
                state={property.state}
                rentAmount={property.rentAmount}
                fixedDepositAmount={property.fixedDepositAmount}
                image={property.images.map((img:string) =>`http://localhost:5100${img}`)}
                amenities={property.amenities}
                propertyId={property.id}
                onViewDetails={() => handleViewDetails(property)}
                onApprove={() => handleApprovalAction(property.id, "approve")}
                onReject={() => handleApprovalAction(property.id, "reject")}
                mode="admin"
              />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No unverified properties found.
          </Typography>
        )}
      </Grid>

      {/* View Details Modal */}
      <Dialog open={open} onClose={handleDetailClose} maxWidth="md" fullWidth>
        {selectedProperty && (
          <>
            <DialogTitle>{selectedProperty.title}</DialogTitle>
            <DialogContent
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              {/* Left Side - Image */}
              <Box sx={{ flex: { xs: "0 0 auto", md: "0 0 45%" } }}>
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
                  <strong>Rent:</strong> ₹
                  {selectedProperty.rentAmount.toLocaleString()}
                </Typography>
                <Typography mb={1}>
                  <strong>Deposit:</strong> ₹
                  {selectedProperty.fixedDepositAmount.toLocaleString()}
                </Typography>
                <Typography mb={1}>
                  <strong>Description:</strong> {selectedProperty.description}
                </Typography>
                <Typography mb={1}>
                  <strong>Owner:</strong> {selectedProperty.owner?.name}
                </Typography>
                <Typography mb={1}>
                  <strong>Owner Contact:</strong>{" "}
                  {selectedProperty.owner?.email}
                </Typography>
                <Typography mb={1}>
                  <strong>Agent:</strong> {selectedProperty.agent?.name}
                </Typography>
                <Typography mb={1}>
                  <strong>Agent Contact:</strong>{" "}
                  {selectedProperty.agent?.email}
                </Typography>

                <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                  {selectedProperty.amenities?.map(
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
    </Box>
  );
}

export default VerifyProperty;
