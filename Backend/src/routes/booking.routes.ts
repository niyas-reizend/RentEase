import { Router } from "express";
import { handleCreateBooking, handleGetBookedPropertiesByIdOwnerId, handleGetOwnerBookings, handleGetTenantBookings, updateBookingStatusController } from "../controllers/booking.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorizeRole";
import { BlockMiddleware } from "../middleware/BlockMiddleware";

const bookingRouter = Router();

bookingRouter.post("/createBooking",authenticate,authorizeRoles("tenant"),BlockMiddleware, handleCreateBooking);
bookingRouter.put("/updateBooking",authenticate,authorizeRoles("owner"),BlockMiddleware,updateBookingStatusController);
bookingRouter.get("/getTenantBooking",authenticate,authorizeRoles("tenant"),handleGetTenantBookings);
bookingRouter.get("/getOwnerBooking",authenticate,authorizeRoles("owner"),handleGetOwnerBookings);
bookingRouter.get("/getOwnerBooking",authenticate,authorizeRoles("owner"),handleGetBookedPropertiesByIdOwnerId)



export default bookingRouter;