import commonAPI from "./commonApi"

const baseURL = "http://localhost:5100"

export const signup = async(formdata:any)=> {
    return  await commonAPI('post',`${baseURL}/auth/register`,formdata)
}
export const login = async(data:any)=> {
    return await commonAPI('post',`${baseURL}/auth/login`,data)
}
export const backEndLogout = async()=>{
    return await commonAPI("post",`${baseURL}/auth/logout`)
}

export const fetchpropertyfortenant = async()=>{
    return await commonAPI('get',`${baseURL}/api/getallpropertyfortenants`)
}

export const addProperty = async(data:any)=>{
    return await commonAPI('post',`${baseURL}/api/add-property`,data)
}

export const getAllAgents = async()=>{
    return await commonAPI('get',`${baseURL}/auth/getAllAgents`)
}

export const getOwnerProperties = async()=>{
    return await commonAPI('get',`${baseURL}/api/getPropertiesByOwnerId`)
}

export const updateProperty = async(id:number,formdata:any)=>{
    return await commonAPI('put',`${baseURL}/api/update/${id}`,formdata)
}

export const getPropertyByPropertyId = async(id:number)=>{
    return await commonAPI("get",`${baseURL}/api/property/${id}`)
}

export const deletePropertyById = async(id:number)=>{
    return await commonAPI("delete",`${baseURL}/api/property/${id}`)
}

export const sendEnquiry = async(data:any)=>{
    return await commonAPI("post",`${baseURL}/api/createEnquiry`,data)
}

export const bookProperty = async(bookingFormData:any)=>{
    return await commonAPI("post",`${baseURL}/api/createBooking`,bookingFormData)
}

export const getTenantProfile = async()=>{
    return await commonAPI("get",`${baseURL}/api/tenantProfilebyid`)
}

export const createProfile = async(data:any)=>{
    return await commonAPI("post",`${baseURL}/api/createProfile`,data)
}

export const getTenantEnquiries = async()=>{
    return await commonAPI("get",`${baseURL}/api/getEnquiryByTenant`)
}

export const getTenantBooking =  async()=>{
    return await commonAPI("get",`${baseURL}/api/getTenantBooking`)
}

export const getOwnerEnquiries = async()=>{
    return await commonAPI("get",`${baseURL}/api/getEnquiryByOwner`)
}

export const replyToEnquiry = async(id:number,data:any)=>{
    return await commonAPI("patch",`${baseURL}/api/enquiry/reply/${id}`,data)
}

export const getOwnerBookings = async()=>{
    return await commonAPI("get",`${baseURL}/api/getOwnerBooking`)
}

export const updateBookingStatus = async(payload:any) =>{
    return await commonAPI("put",`${baseURL}/api/updateBooking`,payload)
}

export const getOwnerAgreements = async()=>{
    return await commonAPI("get",`${baseURL}/api/ownerAgreements`)
}

export const getTenantAgreements = async()=>{
    return await commonAPI("get",`${baseURL}/api/tenantAgreements`)
}

export const getPropertiesOfAgent = async()=>{
    return await commonAPI("get",`${baseURL}/api/getPropertiesByAgentId`)
}

export const getAgentCommissionsByAgentId = async()=>{
    return await commonAPI("get",`${baseURL}/api/getCommissionByAgentId`)
}

export const getAllUsers = async()=>{
    return await commonAPI("get",`${baseURL}/auth/getallusers`)
}

export const blockUsers = async(data:any)=>{
    return await commonAPI("patch",`${baseURL}/auth/users/block-status`,data)
}

export const getAllAgreements = async()=>{
    return await commonAPI("get",`${baseURL}/api/getallagreements`)
}

export const getAllTenants = async()=>{
    return await commonAPI("get",`${baseURL}/api/getalltenants`)
}
export const verifyTenant = async(data:any)=>{
    return await commonAPI("patch",`${baseURL}/api/verifyTenants`,data)
}
export const getUnverifiedProperties = async()=>{
    return await commonAPI("get",`${baseURL}/api/getAllUnverifiedProperties`)
}

export const approveProperties = async(data:any)=>{
    return await commonAPI("put",`${baseURL}/api/propertyApproval`,data)
}

export const getAllProperties = async()=>{
    return await commonAPI("get",`${baseURL}/api/getallproperty`)
}
export const forgotPassword = async(email:any,)=>{
    return await commonAPI("post",`${baseURL}/api/forgot-password`,email)
}
export const resetPassword = async(token:any,newPassword:string)=>{
    return await commonAPI("post",`${baseURL}/api/reset-password/${token}`,{newPassword})
}