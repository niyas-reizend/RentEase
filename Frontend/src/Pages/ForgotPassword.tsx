


import { useState } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  Paper, 
  InputAdornment,
  CircularProgress,
  Fade
} from "@mui/material";
import { 
  EmailRounded, 
  ArrowBack,
  CheckCircleOutline 
} from "@mui/icons-material";
import { forgotPassword } from "../Services/allApi";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    
    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message || "Password reset link sent to your email");
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Navigate back to login page - implement your navigation logic here
    navigate("/login");
    console.log("Navigate back to login");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: isMobile ? 2 : 4,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={isMobile ? 0 : 8}
          sx={{
            width: "100%",
            maxWidth: 450,
            padding: isMobile ? 3 : 4,
            borderRadius: 2,
            background: "white",
            border: isMobile ? "1px solid #e0e0e0" : "none",
          }}
        >
          <Box textAlign="center" mb={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <EmailRounded fontSize="medium" />
              </Box>
            </Box>
            
            <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
              Forgot Password
            </Typography>
            
            <Typography variant="body2" color="textSecondary" paragraph>
              {isSubmitted 
                ? "Check your email for further instructions" 
                : "Enter your email address and we'll send you a link to reset your password"
              }
            </Typography>
          </Box>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRounded color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your registered email"
                disabled={isLoading}
                sx={{ mb: 2 }}
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  mt: 1,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              
              <Box mt={2} textAlign="center">
                <Button
                  startIcon={<ArrowBack />}
                  onClick={handleBackToLogin}
                  sx={{ textTransform: "none" }}
                  disabled={isLoading}
                >
                  Back to Login
                </Button>
              </Box>
            </form>
          ) : (
            <Box textAlign="center">
              <CheckCircleOutline 
                color="success" 
                sx={{ fontSize: 60, mb: 2 }} 
              />
              
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  textAlign: "left",
                  alignItems: "center"
                }}
              >
                {message}
              </Alert>
              
              <Typography variant="body2" color="textSecondary" paragraph>
                Didn't receive the email? Check your spam folder 
                <Button 
                  color="primary" 
                  size="small" 
                  onClick={() => setIsSubmitted(false)}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  try again
                </Button>
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBackToLogin}
                sx={{ 
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2
                }}
              >
                Back to Login
              </Button>
            </Box>
          )}

          {error && !isSubmitted && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                alignItems: "center"
              }}
            >
              {error}
            </Alert>
          )}
        </Paper>
      </Fade>
    </Box>
  );
}