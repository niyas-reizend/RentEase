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
  Grid,
  TextField,
  MenuItem,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import {
  deletePropertyById,
  getAllAgents,
  getOwnerProperties,
  getPropertyByPropertyId,
  updateProperty,
} from "../../Services/allApi";
import { toast } from "react-toastify";



export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [agents, setAgents] = useState<{ id: number; name: string }[]>([]);
  const [selectedPropertyDelete, setSelectedPropertyDelete] = useState<number|null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    city: "",
    state: "",
    address: "", // for editing
    rentAmount: "",
    fixedDepositAmount: "",
    agentId: "",
    description: "",
    amenities: "",
  });

  // to get property by property id
  const fetchPropertyByPropertyId = async (property: number) => {
    try {
      const res = await getPropertyByPropertyId(property);
      setSelectedProperty(res.data);
      const data = res.data;
      console.log("the data is", data);
      console.log("the data title", data.title);

      setEditForm({
        title: data.title || "",
        city: data.city || "",
        state: data.state || "",
        address: data.address || "",
        rentAmount: data.rentAmount || "",
        fixedDepositAmount: data.fixedDepositAmount || "",
        agentId: data.agent?.id || "",
        description: data.description || "",
        amenities: data.amenities?.join(", ") || "",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditClick = async (property: any) => {
    await fetchPropertyByPropertyId(property);
    // console.log("selectedProperty", selectedProperty);
    setEditOpen(true);
  };
  const handleEditChange = (e: any) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // to get all the agents
  const fetchAgents = async () => {
    const res = await getAllAgents();

    setAgents(res.data);
  };

  //to get the properties under the owner
  const ownerProperties = async () => {
    try {
      const res = await getOwnerProperties();
      console.log(res);

      setProperties(res.data.data);
    } catch (error) {
      console.log("Error in fetching properties", error);
    }
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();

    Object.entries(editForm).forEach(([key, value]) => {
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
    console.log("form data for update ", [...formData.entries()]);

    try {
      const updatedProperty = await updateProperty(
        selectedProperty.id,
        formData
      );
      //the blelow code is for refreshing the propertylist or to make the updated chages visivle
      setProperties((prev: any) =>
        prev.map((p: any) =>
          p.id === updatedProperty.data.updatedProperty.id
            ? updatedProperty.data.updatedProperty
            : p
        )
      );
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update property:", err);
    }
  };

  useEffect(() => {
    ownerProperties();
    fetchAgents();
  }, []);

  const handleDeleteClick =  (id:number) => {
      setDeleteOpen(true);
      setSelectedPropertyDelete(id)

      console.log(" opening modal for Deleting property",);
  };

    const handleDelete = async () => {
    try {
      console.log("Deleting property");
      await deletePropertyById(selectedPropertyDelete!);
      // Immediately remove it from UI
      setProperties((prev: any) => prev.filter((p: any) => p.id !== selectedPropertyDelete));
      setDeleteOpen(false)
      toast.success("Property deleted Successfully")
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast.error("Failed to delete the property")
    }
  };



  return (
    <>
      <Typography variant="h5" gutterBottom>
        My Properties
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Rent</TableCell>
              <TableCell>Deposit</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property: any) => (
              <TableRow key={property.id}>
                <TableCell>{property.title}</TableCell>
                <TableCell>{property.city}</TableCell>
                <TableCell>{property.rentAmount}</TableCell>
                <TableCell>{property.fixedDepositAmount}</TableCell>
                <TableCell>{property.isApproved ? "Yes" : "No"}</TableCell>
                <TableCell>{property.agent?.name || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(property.id)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(property.id)}
                  // onClick={()=>setDeleteOpen(true)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* edit form modal */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Title"
                name="title"
                value={editForm.title}
                fullWidth
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="City"
                name="city"
                value={editForm.city}
                fullWidth
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="State"
                name="state"
                value={editForm.state}
                fullWidth
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Address"
                name="address"
                value={editForm.address}
                fullWidth
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Rent Amount"
                type="number"
                name="rentAmount"
                value={editForm.rentAmount}
                fullWidth
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Deposit"
                type="number"
                name="fixedDepositAmount"
                value={editForm.fixedDepositAmount}
                fullWidth
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                select
                fullWidth
                label="Select Agent"
                name="agentId"
                value={editForm.agentId}
                onChange={handleEditChange}
              >
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                name="description"
                value={editForm.description}
                fullWidth
                multiline
                rows={3}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Amenities (comma separated)"
                name="amenities"
                value={editForm.amenities}
                fullWidth
                onChange={handleEditChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Update
          </Button>
        </DialogActions>
      </Dialog>


      {/* delete modal  */}

      <Dialog open={deleteOpen} maxWidth="sm" fullWidth>
        <DialogContent>
          <Grid container spacing={2} justifyContent={"space-between"}>
            <Grid>
            <Typography>
                Are you sure .Do you want to delete the Property?
            </Typography>
            </Grid>
            <Grid>
              <Box>
                <Button onClick={()=>setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={()=>handleDelete()}>
                  Delete
                </Button>
              </Box>
            </Grid>

          </Grid>

        </DialogContent>
      </Dialog>
    </>
  );
}
