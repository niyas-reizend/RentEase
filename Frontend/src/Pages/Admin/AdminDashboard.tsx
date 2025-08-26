import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { fetchpropertyfortenant, getAllAgreements, getAllProperties, getAllTenants, getAllUsers, getUnverifiedProperties } from "../../Services/allApi";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  // store counts
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [verifiedProperties, setVerifiedProperties] = useState(0);
  const [unverifiedProperties, setUnverifiedProperties] = useState(0);
  const [totalAgreements, setTotalAgreements] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // total users
        const fetchAllUsers = await getAllUsers() ;
        setTotalUsers(fetchAllUsers.data.length);

        // total properties
        const fetchAllProperty = await getAllProperties();
        setTotalProperties(fetchAllProperty.data.length);

        // verified properties
        const verifiedPropsRes = await fetchpropertyfortenant() ;
        setVerifiedProperties(verifiedPropsRes.data.length);

        // unverified properties
        const unverifiedPropsRes = await getUnverifiedProperties() ;
        setUnverifiedProperties(unverifiedPropsRes.data.length);

        // agreements
        const agreementsRes = await getAllAgreements();
        setTotalAgreements(agreementsRes.data.length);

        // total tenants
        const tenantsRes = await getAllTenants();
        setTotalTenants(tenantsRes.data.length);


      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const cards = [
    { title: "Total Users", value: totalUsers },
    { title: "Total Properties", value: totalProperties },
    { title: "Verified Properties", value: verifiedProperties },
    { title: "Unverified Properties", value: unverifiedProperties },
    { title: "Total Agreements", value: totalAgreements },
    { title: "Total Tenants", value: totalTenants },
  ];

  return (
    <div style={{ padding: "24px"}}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3} >
        {cards.map((card, index) => (
          <Grid size={{xs:12,sm:6,md:4}} key={index}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
                transition: "0.3s",
                border:"1px solid cyan",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4" color="primary">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminDashboard;
