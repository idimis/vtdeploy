
export const api = {
    login: async (email: string, password: string) => {
      const response = await fetch("http://localhost:8080/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }
  
      return response.json(); 
    },
  
    getUserDetails: async (token: string) => {
      const response = await fetch("http://localhost:8080/api/v1/user/details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user details.");
      }
  
      return response.json(); 
    },
  };
  
  export const submitPayment = async (eventId: string, formData: { fullName: string, email: string, paymentMethod: string }) => {
    const response = await fetch("http://localhost:8080/api/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, eventId }),
    });
  
    if (!response.ok) {
      throw new Error("Payment failed");
    }
  
    return response.json();
  };



export const fetchEventDetails = async (slug: string) => {
    const response = await fetch(`http://localhost:8080/api/v1/events/${slug}`);
    if (!response.ok) {
      throw new Error("Event not found");
    }
    return response.json();
  };
  