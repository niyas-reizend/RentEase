import express from "express";
import authRouter from "./routes/auth.routes";
import propertyRouter from "./routes/property.route";
import agreementRouter from "./routes/agreement.routes";
import enquiryRouter from "./routes/enquiry.routes";
import commissionRouter from "./routes/commission.routes";
import passwordRouter from "./routes/password.routes";
import path from "path";
import tenantProfileRouter from "./routes/tenantProfile.routes";
import bookingRouter from "./routes/booking.routes";
// import dashboardRoutes from "./routes/dashboard.routes";
import cookieParser from "cookie-parser";
import cors from 'cors'


const app = express();

app.use(cors({
  origin: "http://localhost:4000", // Your Vite frontend port
  credentials: true,               // if sending cookies/auth headers
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use("/auth",authRouter);
app.use("/api",propertyRouter);
app.use("/api",agreementRouter);
app.use("/api",enquiryRouter);
app.use("/api",commissionRouter);
app.use("/api",passwordRouter);
app.use("/api",tenantProfileRouter);
app.use("/api",bookingRouter);
// app.use("/api",dashboardRoutes);



export default app;
