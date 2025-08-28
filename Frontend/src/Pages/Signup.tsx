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
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { signup as signupApi } from "../Services/allApi";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant", // default role
  });
  const [showPassword, setShowPassword] = useState(false);

  const roles = ["admin", "owner", "tenant", "agent"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signupApi(formData); // calling signup API from backend
      // alert("Signup successful! Please login.");
      toast.success("Signup Successfull ! Please Login.")
      navigate("/login");
    } catch (err: any) {
      if(err.data && err.data.error){
        toast.error(err.data.error)
      }
      else{
        toast.error("Something Went Wrong ,Please Try again Later!.")
      }
     
    }
  };

  return (
    <div>
      <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
      >
        <Paper
          elevation={5}
          sx={{ p: 4, width: 500, borderRadius: 5 }}
        >

          <Typography
            variant="h2"            
            sx={{ fontWeight: "bold",
               mb: 5 ,
               textAlign:"center",
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            gutterBottom
          >
            RenatEase
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 5 ,color:" #1976d2"}}
            gutterBottom
          >
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              type="text"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#129990",
                  },
                },
              }}
            />
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
                  "&.Mui-focused fieldset": {
                    borderColor: "#129990",
                  },
                },
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
                  "&.Mui-focused fieldset": {
                    borderColor: "#129990",
                  },
                },
              }}
              InputProps={{
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
            <TextField
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#129990",
                  },
                },
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: 50 }}
            >
              <h2>Sign Up</h2>
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </div>
  );
};

export default Signup;
