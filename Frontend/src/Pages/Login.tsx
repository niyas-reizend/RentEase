import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// import { Link } from "react-router-dom";
import { login as loginApi } from "../Services/allApi";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AccountCircle, Email } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginApi(formData); //calling the login api from backend
      const user = res.data.user;

      //   calling the login function in the context to store in localstorage
      login(res.data.user, res.data.tokens.accessToken);
      // console.log(res.data);
      // Redirect based on role
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          toast.success("Login Successfull.");
          break;
        case "owner":
          navigate("/owner-dashboard");
          toast.success("Login Successfull.");

          break;
        case "tenant":
          navigate("/tenant-dashboard");
          toast.success("Login Successfull.");

          break;
        case "agent":
          navigate("/agent/properties");
          toast.success("Login Successfull.");
          break;
        default:
          navigate("/");
      }
    } catch (err: any) {
      const errMsg =
        (err.data && err.data.error) ||
        err.request ||
        "An unexpected error occurred.";
      toast.error(errMsg);
      // if (err.data && err.data.error) {
      //   // Backend sent an error response
      //   toast.error(err.data.error);
      // } else if (err.request) {
      //   // No response received from backend
      //   toast.error("No response from server. Please try again later.");
      // } else {
      //   // Something else happened
      //   toast.error("An unexpected error occurred.");
      // }
    }
  };

  return (
  
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: isMobile ? 2 : 4,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: isMobile ? 3 : 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <AccountCircle
            sx={{
              fontSize: 60,
              color: "primary.main",
              background:
                "linear-gradient(45deg,rgb(240, 242, 245) 30%,rgb(13, 113, 196) 90%)",
              borderRadius: "50%",
              p: 1,
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            gutterBottom
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sign in to continue to your account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "&.Mui-focused fieldset": {
                  borderColor: "#2196f3",
                  borderWidth: 2,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "&.Mui-focused fieldset": {
                  borderColor: "#2196f3",
                  borderWidth: 2,
                },
              },
            }}
            InputProps={{
              // startAdornment: (
              //   <InputAdornment position="start">
              //     <Lock color="primary" />
              //   </InputAdornment>
              // ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              height: 50,
              mt: 2,
              borderRadius: 3,
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .2)",
            }}
          >
            Login
          </Button>

          <Box mt={2} textAlign="right">
            <Button
              href="/forgot-password"
              color="primary"
              size="small"
              sx={{ textTransform: "none", fontSize: "14px" }}
            >
              Forgot Password?
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don't have an account?{" "}
            <Button
              href="/signup"
              color="primary"
              size="small"
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Sign Up
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
