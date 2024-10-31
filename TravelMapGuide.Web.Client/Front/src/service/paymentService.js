import { API_ENDPOINTS } from "../constants/Endpoints";

export const makePayment = async (paymentData,token) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.DEFAULT_URL}api/Payments/MakePayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(paymentData),
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, errorMessage: data.errormessage || "Payment error" };
      }
    } catch (error) {
      console.error("Payment error:", error);
      throw new Error("Payment error.");
    }
  };