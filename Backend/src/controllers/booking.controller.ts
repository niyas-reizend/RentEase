import { Request, Response } from "express";
import { BookingStatus } from "../entities/Booking";
import { createBooking, getBookedPropertiesByOwnerId, getOwnerBookings, getTenantBookings, updateBookingStatus } from "../services/booking.service";


// create booking 
export const handleCreateBooking = async (req: any, res: Response) => {
  try {
    const tenantId = req.user.id
    const {  propertyId, rentAmount, fixedDeposit,agreementStartDate,agreementEndDate } = req.body;
    const booking = await createBooking(tenantId, propertyId, rentAmount, fixedDeposit,agreementStartDate,agreementEndDate );
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


// updating or approving the booking 
export const updateBookingStatusController = async (req: Request, res: Response) => {
  try {
    const { bookingId, status } = req.body;

    // Validate bookingId
    if (!bookingId || isNaN(Number(bookingId))) {
      return res.status(400).json({ error: "Invalid or missing bookingId" });
    }
    // Validate status value
    const isValidStatus = Object.values(BookingStatus).includes(status);
    if (!isValidStatus) {
      return res.status(400).json({ error: "Invalid booking status" });
    }    
    // Call service
    const result = await updateBookingStatus(Number(bookingId), status as BookingStatus);
    if(result?.success){
        return res.status(200).json({message:result.message,agreementDetails:result.agreementDetails,commission:result.commission})
    }
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "An error occurred while updating booking status",
    });
  }
};


// export const handleGetBookingsForProperty = async (req: Request, res: Response) => {
//   try {
//     const { propertyId } = req.params;
//     const bookings = await getBookingsForProperty(parseInt(propertyId));
//     res.json(bookings);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// };


// get the bookings done by the tenant 
export const handleGetTenantBookings = async (req: any, res: Response) => {
  try {
    const  tenantId  = req.user.id;    
    const bookings = await getTenantBookings((tenantId));
    res.json(bookings);
    
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// get the bookings related to the owner 
export const handleGetOwnerBookings = async (req: any, res: Response) => {
  try {
    const  ownerId  = req.user.id;    
    const bookings = await getOwnerBookings((ownerId));
    res.json(bookings);
    
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// get booked properties by owner id 
export const handleGetBookedPropertiesByIdOwnerId = async(req:any,res:Response) =>{
  try{
    const ownerId = req.user.id ;
    const BookedProperties = await getBookedPropertiesByOwnerId(ownerId);
    res.json(BookedProperties);

  }catch(err:any){
    res.status(400).json({error:err.message})
  }
}
