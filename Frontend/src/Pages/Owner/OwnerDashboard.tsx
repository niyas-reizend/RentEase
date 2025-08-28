
import { Button,  Grid, Card, CardContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
  addProperty,
  getAllAgents,
  getOwnerProperties,
  getOwnerBookings,
  getOwnerEnquiries,
  getOwnerAgreements,
} from "../../Services/allApi";
import AddPropertyDialog from "../../Components/AddPropertyDialogue";
import { toast } from "react-toastify";

export default function OwnerDashboard() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    rentAmount: "",
    fixedDepositAmount: "",
    address: "",
    city: "",
    state: "",
    amenities: "",
    agentId: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [agents, setAgents] = useState<{ id: number; name: string }[]>([]);

  // new states for dashboard data
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [agreements, setAgreements] = useState<any[]>([]);

  // --- handlers for form ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setImages((prev) => [...prev, ...Array.from(e.target.files!)]);
  }
  };

  const handleSelectChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "amenities") {
        const amenitiesArray = value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
        formData.append(key, JSON.stringify(amenitiesArray));
      } else {
        formData.append(key, value);
      }
    });

    images.forEach((file) => formData.append("images", file));
    formData.append("ownerId", localStorage.getItem("userId") || "");

    try {
      await addProperty(formData);
      toast.success("Property Added Sucessfully")
      setOpen(false);
      ownerProperties(); // refresh after adding
    } catch (err:any) {
      console.error(err);
      toast.error(err.data.error)
    }
  };

  // --- fetch APIs ---
  const ownerProperties = async () => {
    try {
      const res = await getOwnerProperties();
      setProperties(res.data.data);
    } catch (error) {
      console.log("Error in fetching properties", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await getOwnerBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await getOwnerEnquiries();
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAgreements = async () => {
    try {
      const res = await getOwnerAgreements();
      setAgreements(res.data);
    } catch (err: any) {
      console.log("Error in fetching Agreements", err);
    }
  };

  // --- useEffect to load dashboard data ---
  useEffect(() => {
    ownerProperties();
    fetchBookings();
    fetchEnquiries();
    fetchAgreements();
  }, []);

  // fetch agents only when dialog is open
  useEffect(() => {
    if (open) {
      getAllAgents()
        .then((res) => {
          setAgents(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [open]);

  // --- derived values ---
  const totalProperties = properties.length;
  const approvedProperties = properties.filter((p: any) => p.isApproved).length;
  const pendingProperties = totalProperties - approvedProperties;
  const pendingBookings = bookings.filter((b: any) => b.status === "pending").length;
  const enquiriesToReply = enquiries.filter((enq):any=>enq.reply==="null").length;
  const totalAgreements = agreements.length;



    const cards = [
    { title: "Total Properties", value: totalProperties },
    { title: "Approved Properties", value: approvedProperties },
    { title: "Properties to Be Approved", value: pendingProperties },
    { title: "Pending Bookings", value: pendingBookings },
    { title: "Enquiries To Reply", value: enquiriesToReply },
    { title: "Total Agreements", value: totalAgreements },
  ];

  return (
    <>
{/* Add Property Section */}
<Grid container spacing={3} mb={3}>
  <Grid size={{xs:12}} >
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 8px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.02)" },
        p: 4,
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Want to add a new property?
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Click the button below to register your property.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ borderRadius: "12px", px: 4 }}
        >
          Add Property
        </Button>
      </CardContent>
    </Card>
  </Grid>
</Grid>

{/* Summary Cards Section */}
<Grid container spacing={3}>
  {cards.map((card, index) => (
    <Grid size={{xs:12,sm:6,md:4}}  key={index}>
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          border:"1px solid blue",

          transition: "0.3s",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {card.title}
          </Typography>
          <Typography variant="h4" color="primary">
            {card.value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

      {/* Add Property Dialog */}
      <AddPropertyDialog
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        agents={agents}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        images={images}
      />
    </>
  );
}
