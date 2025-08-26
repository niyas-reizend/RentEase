import  { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, CircularProgress
} from "@mui/material";
import { blockUsers, getAllUsers } from "../../Services/allApi";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

const UserList= () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(); 
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId: number, action: "block" | "unblock") => {
    try {
    const payload = {
        userId:userId,
        action:action
    }
      await blockUsers(payload);
      if(action === "block"){
        toast.success("User Blocked Successfully")
      }
      if(action=="unblock"){
        toast.success("User Unblocked Successfully")
      }
      fetchUsers(); // refresh list
    } catch (error) {
      console.error(`Error trying to ${action} user:`, error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Email</b></TableCell>
            <TableCell><b>Role</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            <TableCell><b>Action</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.isBlocked ? "Blocked ❌" : "Active ✅"}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color={user.isBlocked ? "success" : "error"}
                  onClick={() =>
                    toggleBlock(user.id, user.isBlocked ? "unblock" : "block")
                  }
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
