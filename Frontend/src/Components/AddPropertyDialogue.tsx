import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { type SelectChangeEvent } from "@mui/material";

interface AddPropertyDialogProps {
  open: boolean;
  onClose: () => void;
  form: any;
  agents: { id: number; name: string }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  images:File[];
}

export default function AddPropertyDialog({
  open,
  onClose,
  form,
  agents,
  handleChange,
  handleSelectChange,
  handleFileChange,
  handleSubmit,
  images
}: AddPropertyDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Property</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="City"
                name="city"
                fullWidth
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="State"
                name="state"
                fullWidth
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Address"
                name="address"
                fullWidth
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Rent Amount"
                name="rentAmount"
                type="number"
                fullWidth
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Deposit"
                name="fixedDepositAmount"
                type="number"
                fullWidth
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Select Agent</InputLabel>
                <Select
                  name="agentId"
                  value={form.agentId}
                  onChange={handleSelectChange}
                  required
                >
                  {agents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                required
                multiline
                rows={3}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Amenities (comma separated)"
                name="amenities"
                fullWidth
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <input
                type="file"
                accept="image/*"
                multiple
                required
                onChange={handleFileChange}
              />
              {images?.length > 0 && (
                <p>
                  {images?.length} file{images?.length > 1 ? "s" : ""} selected
                </p>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
