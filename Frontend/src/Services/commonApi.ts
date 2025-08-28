

    import axios from "axios";


    const baseURL = "http://localhost:5100";

    // 🔹 Refresh helper
    const refreshAccessToken = async () => {
      try {
        const res = await axios.post(
          `${baseURL}/auth/refresh` ,
          {},
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;
      
        localStorage.setItem("token", newToken);
        return newToken;
      } catch (err) {
        return null;
      }
    };

    const commonAPI = async(
      httpMethod: 'get' | 'post' | 'put' |'patch' | 'delete',
      url: string,
      reqBody?: any
    )=> {
      const token = localStorage.getItem("token");

      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      //  Don't set application/json for FormData
      if (!(reqBody instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const reqConfig: any = {
        method: httpMethod,
        url,
        data: reqBody,
        headers,
        withCredentials:true,
      };

      try {
        const response = await axios(reqConfig);
        return response;
      } catch (error: any) {
        // if token expired or invalid
        if (error?.response?.status === 403 ) {
          // alert("401")
          console.warn("Access Token expired or invalid. trying to refresh");

          const newToken = await refreshAccessToken();

          if (newToken){
            reqConfig.headers.Authorization = `Bearer ${newToken}`;
            return await axios(reqConfig); //this is for retry
          }else{
            console.warn("Refresh failed.Logging Out....")
            localStorage.removeItem("token");
            localStorage.removeItem("authUser");
            window.location.href = "/login";
          }
        }
        throw error.response || error;
      }
    };

    export default commonAPI