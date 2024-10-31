import { API_ENDPOINTS } from "../constants/Endpoints";

export const fetchTravelsByUserId = async (userId) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.DEFAULT_URL}api/Travel/GetTravelByUserId?userId=${userId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching travels by user ID:", error);
    throw error;
  }
};

export const fetchAllTravels = async () => {
  try {
    const response = await fetch(`${API_ENDPOINTS.DEFAULT_URL}api/Travel/Get`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all travels:", error);
    throw error;
  }
};


export const submitTravelData = async (token, formData) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.DEFAULT_URL}api/Travel/Post`,
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to submit travel data:", errorData);
      throw new Error("Failed to submit travel data");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error submitting travel data:", error);
    throw error;
  }
};
