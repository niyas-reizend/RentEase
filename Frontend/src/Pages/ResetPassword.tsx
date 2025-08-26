
// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { TextField, Button, Box, Typography, Alert } from "@mui/material";
// import {  resetPassword } from "../Services/allApi";

// export default function ResetPassword() {
//   const { token } = useParams<{ token: string }>();
//   const navigate = useNavigate();
//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     try {
//         console.log("hereeeee")
//     //   const res = await axios.post(`/api/auth/reset-password/${token}`, { newPassword });
//       const res = await resetPassword(token,newPassword)
//       console.log("res",res)
//       setMessage(res.data.message);
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err: any) {

//       setError(err.response?.data?.error || "Something went wrong");
//       console.log(err)
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//       <Box maxWidth={400} width="100%">
//         <Typography variant="h5" mb={2}>Reset Password</Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="New Password"
//             type="password"
//             fullWidth
//             required
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             margin="normal"
//           />
//           <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleSubmit}>
//             Reset Password
//           </Button>
//         </form>
//         {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
//         {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//       </Box>
//     </Box>
//   );
// }






import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff,
  LockReset
} from "@mui/icons-material";
import { resetPassword } from "../Services/allApi";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    
    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.data.message || "Password reset successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <LockReset color="primary" sx={{ fontSize: 40, mb: 2 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Enter your new password below
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              slotProps={{
                input:{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
            }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Reset Password"}
            </Button>
            
            {message && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}