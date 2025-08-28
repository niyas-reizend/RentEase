import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { getAllTenants, verifyTenant } from "../../Services/allApi";
import { toast } from "react-toastify";

interface TenantProfile {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  identityDocumentUrl: string;
  isVerified: boolean;
}

const TenantVerification = () => {
  const [tenants, setTenants] = useState<TenantProfile[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await getAllTenants();
      setTenants(res.data);
    } catch (err) {
      console.error("Error fetching tenants", err);
    }
  };

  const handleVerify = async (id: number, verify: boolean) => {
    try {
      const verifydata = {
        userId: id,
        isVerified: verify,
      };
      await verifyTenant(verifydata);
      if (verify == true) {
        toast.success("Tenant verified");
      }
      if (verify == false) {
        toast.success("Tenant Denied");
      }
      fetchTenants(); // refresh list after verify/deny
    } catch (err) {
      console.error("Error verifying tenant", err);
    }
  };

  const handleViewDoc = (url: string) => {
    const newUrl = `http://localhost:5100${url}`;
    console.log(newUrl);

    setSelectedDoc(newUrl);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedDoc(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tenant Verification</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Document</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.user?.id}</TableCell>
              <TableCell>{tenant.user?.name}</TableCell>
              <TableCell>{tenant.user?.email}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => handleViewDoc(tenant.identityDocumentUrl)}
                >
                  View Document
                </Button>
              </TableCell>
              <TableCell>
                {/* {tenant.isVerified ? " Verified" : " Not Verified"} */}
                <Typography>
                  {tenant.isVerified ? "Verified" : "Not Verified"}
                </Typography>
              </TableCell>
              <TableCell>
                {!tenant.isVerified && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleVerify(tenant.user?.id, true)}
                    >
                      Verify
                    </Button>

                  </Stack>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Document */}
      <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle>Tenant Document</DialogTitle>
        <DialogContent>
          {selectedDoc &&
            (selectedDoc.endsWith(".pdf") ? (
              <iframe
                src={selectedDoc}
                width="100%"
                height="500px"
                title="Tenant Document"
              />
            ) : (
              <img
                src={selectedDoc}
                alt="Tenant Document"
                style={{ width: "100%", height: "auto" }}
              />
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantVerification;
