
import { Link } from "react-router-dom";

const Unauthorized = () => {
  
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1> Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Go Back</Link>
    </div>
  );
};

export default Unauthorized;