import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Divider,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { createProfile, getTenantProfile } from "../../Services/allApi";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

type Profile = {
  isVerified: boolean;
  identityDocumentUrl: string;
  user: any;
};

function TenantProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const { user }: any = useAuth();

  const handleOpen = () => {
    setSelectedDoc(`http://localhost:5100${profile?.identityDocumentUrl}`);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedDoc(null);
  };

  // Fetch tenant profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getTenantProfile();
        setProfile(res.data);
      } catch (err) {
        console.log("Tenant Profile doesnt exist for the user", err);

        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select a document to upload");

    const formData = new FormData();
    formData.append("tenantId", user?.id);
    formData.append("identityDocumentUrl", file);

    await createProfile(formData);

    toast.success("Profile created Succesfully.");
    window.location.reload(); // refresh to show updated profile
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        fontWeight="bold"
        sx={{ mb: 3 }}
      >
        Tenant Dashboard
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {!profile ? (
          <Grid size={{ xs: 12, sm: 8, md: 6, lg: 5 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                p: 2,
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  No Profile Found
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please create your tenant profile by uploading your identity
                  document.
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Upload Document
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>

                  {/* Show file name if selected */}
                  {file && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                       {file.name} -   Selected
                    </Typography>
                  )}
                </Box>

                {/* Submit */}
                <Button
                  variant="contained"
                  sx={{ mt: 2, ml: 2, borderRadius: 2 }}
                  onClick={handleSubmit}
                >
                  Create Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <Grid size={{ xs: 12, sm: 10, md: 7, lg: 6 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                p: 2,
              }}
            >
              <CardContent>
                {/* Avatar & Name */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: "primary.main",
                      mr: 2,
                      fontSize: 24,
                    }}
                  >
                    {profile.user.name[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {profile.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.user.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Verification Status */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Profile Status:{" "}
                  <Box
                    component="span"
                    fontWeight="bold"
                    color={profile.isVerified ? "success.main" : "warning.main"}
                  >
                    {profile.isVerified ? " Verified" : " Pending Verification"}
                  </Box>
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Identity Document:{" "}
                  <Button
                    onClick={handleOpen}
                    sx={{ fontWeight: "bold", textTransform: "none" }}
                  >
                    View Document
                  </Button>
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Extra Details */}
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">
                      <strong>Role:</strong> {profile.user.role}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">
                      <strong>Created:</strong>{" "}
                      {new Date(profile.user.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">
                      <strong>Updated:</strong>{" "}
                      {new Date(profile.user.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={
                        profile.user.isBlocked ? "error.main" : "success.main"
                      }
                    >
                      {profile.user.isBlocked ? " Blocked" : " Active"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      {/* Modal */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
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
    </Box>
  );
}

export default TenantProfile;
