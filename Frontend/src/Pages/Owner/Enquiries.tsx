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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { getOwnerEnquiries, replyToEnquiry } from "../../Services/allApi";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [reply, setReply] = useState("");

  // fetch enquiries on load
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await getOwnerEnquiries();
        setEnquiries(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEnquiries();
  }, []);

  // open reply modal
  const handleReplyClick = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setReply(enquiry.reply || "");
    setOpen(true);
  };

  // close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedEnquiry(null);
    setReply("");
  };

  // save reply
  const handleSaveReply = async () => {
    if (!reply.trim()) return;
    const data = { reply: reply };
    try {
      const res = await replyToEnquiry(selectedEnquiry.id, data);
      // update state
      setEnquiries((prev) =>
        prev.map((enq) =>
          enq.id === selectedEnquiry.id
            ? { ...enq, reply: res.data.reply }
            : enq
        )
      );
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Property Enquiries
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Reply</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>{enquiry.property?.title}</TableCell>
                <TableCell>{enquiry.tenant?.name}</TableCell>
                <TableCell>{enquiry.message}</TableCell>
                <TableCell
                  sx={{
                    color: enquiry.reply ? "black" : "red",
                    fontWeight: enquiry.reply ? "normal" : "bold",
                  }}
                >
                  {enquiry.reply || "No reply given"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleReplyClick(enquiry)}
                  >
                    Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reply Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Reply to Enquiry on :{selectedEnquiry?.property?.title}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            label="Your reply"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveReply} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Enquiries;
