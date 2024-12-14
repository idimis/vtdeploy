"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import EventStatisticsWidget from '@/components/EventStatisticsWidget';
import Link from "next/link";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Event {
  id: string;
  title: string;
  dateTimeStart: string;
  reviews: Review[];
}

interface Review {
  eventName: string;
  id: string;
  customerName: string;
  rating: number;
  review: string;
  photoProfileUrl?: string; 
}

interface Voucher {
  voucherId: number;
  eventName: string;
  voucherCode: string;
  status: string;
}


const OrganizerDashboard: React.FC = () => {
  const [data, setData] = useState<any>({ events: [], profile: {} });
  const [activePanel, setActivePanel] = useState("overview");
  const [statistics, setStatistics] = useState<any>(null);
  const [review, setReview] = useState<Review | null>(null);

  const [voucherData, setVoucherData] = useState<Voucher[]>([]); 
  const [loading, setLoading] = useState(true);
  const [voucherCode, setVoucherCode] = useState("");
  const [eventId, setEventId] = useState("");
  const [voucherValue, setVoucherValue] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherType, setVoucherType] = useState<"quantity" | "dateRange">("quantity"); 
  const [quantityLimit, setQuantityLimit] = useState<number>(50); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);


  useEffect(() => {
    fetchData();
    fetchStatistics();
    fetchTransactionHistory();
    fetchReviewsByOrganizer();
    fetchVouchers();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      window.location.href = "/login";
      return;
    }
  
    try {
      const [responseEvents, responseProfile] = await Promise.all([
        fetch("http://localhost:8080/api/v1/events/organizer?size=100", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8080/api/v1/user/details", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      
      if (!responseProfile.ok) {
        throw new Error("Failed to fetch profile data");
      }
  
      const eventsData = await responseEvents.json();
      const profileData = await responseProfile.json();
  
      
      if (profileData.success) {
        setData({
          events: eventsData.success ? eventsData.data.content || [] : [], 
          profile: profileData.data || {}, 
        });
  
        
        setName(profileData.data?.name || "");
        setEmail(profileData.data?.email || "");
        setWebsite(profileData.data?.website || "");
        setAddress(profileData.data?.address || "");
        setPhoneNumber(profileData.data?.phoneNumber || "");
      } else {
        
        setData({
          events: [], 
          profile: {}, 
        });
        console.warn("Profile data is missing.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data.");
    }
  };
  

  const fetchStatistics = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/events/statistics", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        setStatistics(result.data.content || {});
      } else {
        alert("Failed to load statistics.");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      alert("An error occurred while fetching statistics.");
    }
  };

  const fetchTransactionHistory = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/events/transaction-history", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
  
      if (data.success) {
        const transactions = data.data.content || [];
        setTransactions(transactions);
      } else {
        
        console.warn("No transaction history available.");
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };
  


  const fetchReviewsByOrganizer = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/reviews/by-organizer", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const reviewsData = await response.json();
  
      if (reviewsData.success) {
        
        setReview(reviewsData.data.content || []);
      } else {
       
        console.error("Failed to load reviews.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  
  const fetchVouchers = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/vouchers/upcoming", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const vouchersData = await response.json();
  
      if (vouchersData.success) {
        setVoucherData(vouchersData.data.content || []);
      } else {
        console.error("Failed to load vouchers.");
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };
  
  


  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Get the token from localStorage or sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }
  
    // Create the voucher data based on the selected voucher type
    let voucherData: any = {
      eventId,
      voucherCode,
      voucherValue,
      description,
      voucherType,
    };
  
    // If voucher type is "quantity", include the quantity limit data
    if (voucherType === "quantity") {
      voucherData = {
        ...voucherData,
        quantityBasedVoucher: {
          quantityLimit: quantityLimit, // Adjust this based on your form field for quantity
        },
      };
    }
  
    // If voucher type is "dateRange", include the date range data
    if (voucherType === "dateRange") {
      voucherData = {
        ...voucherData,
        dateRangeBasedVoucher: {
          startDate,
          endDate,
        },
      };
    }
  
    try {
      // Make the API request to create the voucher
      const response = await fetch("http://localhost:8080/api/v1/vouchers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(voucherData),
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        // Success, reset the form
        setVoucherSuccess(result.message);
        setVoucherError(null);
        setEventId("");
        setVoucherCode("");
        setVoucherValue(0);
        setDescription("");
        setStartDate("");
        setEndDate("");
        setQuantityLimit(0);  // Reset quantity limit if needed
      } else {
        // Error handling
        setVoucherError(result.message || "Failed to create voucher.");
        setVoucherSuccess(null);
      }
    } catch (error) {
      console.error("Error creating voucher:", error);
      setVoucherError("An error occurred while creating the voucher.");
      setVoucherSuccess(null);
    }
  };
  

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("website", website);
    formData.append("address", address);
    if (profilePicture) formData.append("profilePicture", profilePicture);

    try {
      const response = await fetch("http://localhost:8080/api/v1/user/update-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Profile updated successfully");
        fetchData(); 
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    sessionStorage.clear();
    window.location.href = "/logout";
  };

  const handleHomepage = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col bg-light-gray">
      <Header />
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Sidebar for Desktop */}
        <aside className="bg-purple-600 text-white w-full lg:w-64 py-4 px-8 lg:block hidden">
          <h2 className="text-xl font-bold mb-8">Organizer Dashboard</h2>
          <ul className="space-y-4">
            <li
              onClick={handleHomepage}
              className={`cursor-pointer p-2 rounded-lg ${
                activePanel === "homepage" ? "bg-blue-700" : "hover:bg-blue-600"
              }`}
            >
              Homepage
            </li>
            <li
              onClick={() => setActivePanel("overview")}
              className={`cursor-pointer p-2 rounded-lg ${
                activePanel === "overview" ? "bg-blue-700" : "hover:bg-blue-600"
              }`}
            >
              Overview
            </li>
            <li
              onClick={() => setActivePanel("event")}
              className={`cursor-pointer p-2 rounded-lg ${
                activePanel === "event" ? "bg-blue-700" : "hover:bg-blue-600"
              }`}
            >
              Event
            </li>
            <li
              onClick={() => setActivePanel("voucher")}
              className={`cursor-pointer p-2 rounded-lg ${
                activePanel === "voucher" ? "bg-blue-700" : "hover:bg-blue-600"
              }`}
            >
              Voucher
            </li>
            <li
              onClick={() => setActivePanel("profile")}
              className={`cursor-pointer p-2 rounded-lg ${
                activePanel === "profile" ? "bg-blue-700" : "hover:bg-blue-600"
              }`}
            >
              Profile
            </li>
            <li
              onClick={() => setActivePanel("help")}
              className={`cursor-pointer p-2 rounded-lg ${
                activePanel === "help" ? "bg-blue-700" : "hover:bg-blue-600"
              }`}
            >
              Help
            </li>
  
            {/* Logout Button */}
            <li
              onClick={handleLogout}
              className={`cursor-pointer p-2 rounded-lg ${
                activePanel === "logout" ? "bg-blue-700" : "hover:bg-blue-600"
              }`}
            >
              Logout
            </li>
          </ul>
        </aside>
  
         {/* Mobile Panel Navigation (Horizontal with Wrap) */}
      <div className="lg:hidden flex justify-between bg-purple-600 text-white p-4">
        <ul className="flex flex-wrap justify-start space-x-4 space-y-2">
          <li
            onClick={handleHomepage}
            className={`cursor-pointer p-2 rounded-lg ${
              activePanel === "homepage" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            Homepage
          </li>
          <li
            onClick={() => setActivePanel("overview")}
            className={`cursor-pointer p-2 rounded-lg ${
              activePanel === "overview" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            Overview
          </li>
          <li
            onClick={() => setActivePanel("event")}
            className={`cursor-pointer p-2 rounded-lg ${
              activePanel === "event" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            Event
          </li>
          <li
            onClick={() => setActivePanel("voucher")}
            className={`cursor-pointer p-2 rounded-lg ${
              activePanel === "voucher" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            Voucher
          </li>
          <li
            onClick={() => setActivePanel("profile")}
            className={`cursor-pointer p-2 rounded-lg ${
              activePanel === "profile" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            Profile
          </li>
          <li
            onClick={() => setActivePanel("help")}
            className={`cursor-pointer p-2 rounded-lg ${
              activePanel === "help" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
          >
            Help
          </li>
        </ul>
      </div>
   
  

        {/* Main Content */}
        <main className="flex-grow p-8 overflow-y-auto">
  {/* Overview Panel */}
  {activePanel === "overview" && (
    <section className="h-full mb-8 bg-white p-6 rounded-lg shadow-md flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Event List */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-purple-600 mb-4">Event List</h3>
          <ul className="space-y-4 text-gray-700">
            {data.events.length > 0 ? (
              data.events.map((event: Event) => (
                <li
                  key={event.id}
                  className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-md"
                >
                  <span className="flex-grow text-gray-800">{event.title}</span>
                  <Link
                    href={`/events/${event.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`}
                  >
                    <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-2 px-4 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                      See the Details
                    </button>
                  </Link>
                </li>
              ))
            ) : (
              <p>No events found.</p>
            )}
          </ul>
        </div>

        {/* Right: Organizer Profile */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-purple-600 mb-4">Organizer Profile</h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={data.profile.photoProfileUrl || "/path/to/default-image.jpg"} 
                alt="Organizer Photo"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-gray-700">{data.profile.name}</p>
              <p className="text-gray-600">
                Joined: {new Date(data.profile.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Website:{" "}
                <Link
                  href={`https://${data.profile.website}`}
                  target="_blank"
                  className="text-blue-500"
                >
                  {data.profile.website}
                </Link>
              </p>
              <p className="text-gray-600">Phone: {data.profile.phoneNumber}</p>
              <p className="text-gray-600">Address: {data.profile.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Statistics */}
      <EventStatisticsWidget statistics={statistics} />
    </section>
  )}

          {/* Event Panel */}
          {activePanel === 'event' && (
            <section className="event-section bg-gray-50 p-8 rounded-lg shadow-lg">
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-purple-600">Event Management</h2>
              <Link href="/events/create"> 
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">
          Create Event
        </button>
        </Link> 
            </header>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Event List */}
  <div className="w-full bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold text-purple-600 mb-4">Event List</h3>
    <ul className="space-y-4 text-gray-700">
      {data.events.length > 0 ? (
        data.events.map((event: Event) => (
          <li
            key={event.id}
            className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-4 rounded-md"
          >
            <span>{event.title}</span>
            <Link
              href={`/events/${event.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`}
            >
              <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-2 px-4 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                See the Details
              </button>
            </Link>
          </li>
        ))
      ) : (
        <p>No events found.</p>
      )}
    </ul>
  </div>

          
              {/* Event Statistics */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <EventStatisticsWidget statistics={statistics} />
              </div>
            </div>
        

          {/* Testimonials */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold text-purple-600 mb-4">Audience Reviews</h3>
    {error ? (
      <p className="text-red-500">Error: {error}</p>
    ) : data.events.length > 0 ? (
      data.events
        .filter((event: Event) => event.reviews.length > 0)
        .map((event: Event) => (
          <div key={event.id} className="mb-6">
            <h4 className="text-xl font-semibold mb-2">{event.title}</h4>
            {event.reviews.map((review: Review, index: number) => (
              <div key={index} className="border-b pb-4">
                {review.photoProfileUrl && ( 
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={review.photoProfileUrl} 
                      alt={`${review.customerName} Profile`} 
                      className="object-cover w-full h-full" 
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-2">
                  <p className="text-lg font-semibold">{review.review}</p>
                  <p className="text-sm text-gray-600">- {review.customerName}</p>
                  <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
                </div>
              </div>
            ))}
          </div>
        ))
    ) : (
      <p className="text-gray-600">No events found with reviews.</p>
  )}
</div>
          
                
 {/* Transaction History */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-2xl font-semibold text-purple-600 mb-4">Recent Transactions</h3>
  <div className="bg-gray-200 p-4 rounded-lg">
    <p className="text-center text-xl font-semibold">Transaction History</p>
    <div className="mt-4 space-y-4">
      {transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <div
            key={`${transaction.customerId}-${index}`}  // Unique key using customerId and index
            className="transaction-item bg-white p-4 rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <img
                src={transaction.customerPhotoUrl}
                alt={transaction.customerName}
                className="customer-photo w-12 h-12 rounded-full mr-4"
              />
              <div className="transaction-info flex-1">
                <p className="font-semibold">Customer: {transaction.customerName}</p>
                <p>Event: {transaction.eventTitle}</p>
                <p>Quantity: {transaction.quantity}</p>
                <p>Revenue: Rp {transaction.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  Transaction Date: {new Date(transaction.transactionDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No transactions found.</p>
      )}
    </div>
  </div>
</div>
</div>
          </section>
          
          )}

         {/* Voucher Panel */}
{activePanel === 'voucher' && (
  <section className="voucher-section bg-gray-50 p-8 rounded-lg shadow-lg">
    <header className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-semibold text-purple-600">Voucher Management</h2>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Voucher Creation Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-purple-600 mb-4">Create Voucher</h3>
        {voucherSuccess && <p className="text-green-500 mb-4">{voucherSuccess}</p>}
        {voucherError && <p className="text-red-500 mb-4">{voucherError}</p>}
        <form onSubmit={handleVoucherSubmit}>

        
        <div className="mb-4">
            <label htmlFor="eventID" className="block text-gray-700 font-medium">Event ID</label>
            <input
              type="text"
              id="eventID"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter event ID"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="voucherCode" className="block text-gray-700 font-medium">Voucher Code</label>
            <input
              type="text"
              id="voucherCode"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter Voucher Code"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="voucherValue" className="block text-gray-700 font-medium">Voucher Value (%)</label>
            <input
              type="number"
              id="voucherValue"
              value={voucherValue}
              onChange={(e) => setVoucherValue(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter Voucher Value"
              required
              min="0"
              max="50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter Description"
              required
            />
          </div>


          <div className="flex items-center space-x-4">
  <label className="flex items-center space-x-2">
    <input
      type="radio"
      name="voucherType"
      value="quantity"
      checked={voucherType === "quantity"}
      onChange={() => setVoucherType("quantity")}
      className="accent-purple-600"
    />
    <span>Quantity</span>
  </label>
  <label className="flex items-center space-x-2">
    <input
      type="radio"
      name="voucherType"
      value="dateRange"
      checked={voucherType === "dateRange"}
      onChange={() => setVoucherType("dateRange")}
      className="accent-purple-600"
    />
    <span>Date Range</span>
  </label>
</div>


      {/* Form for quantity voucher */}
      {voucherType === "quantity" && (
        <div className="mb-4">
          <label htmlFor="quantityLimit" className="block text-gray-700 font-medium">
            Quantity Limit
          </label>
          <input
            type="number"
            id="quantityLimit"
            value={quantityLimit}
            onChange={(e) => setQuantityLimit(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter Quantity Limit"
            max="50"
            min="1"
          />
        </div>
      )}

      {/* Form for date range voucher */}
      {voucherType === "dateRange" && (
        <>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-700 font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="endDate" className="block text-gray-700 font-medium">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </>
      )}

          <button
            type="submit"
            className="bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            Generate Voucher
          </button>
        </form>
      </div>

         {/* Voucher List */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-2xl font-semibold text-purple-600 mb-4">Voucher List</h3>
  <div className="overflow-x-auto">
    {voucherData && voucherData.length > 0 ? (
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-purple-100">
            <th className="px-4 py-2 text-left text-purple-600">Event Name</th>
            <th className="px-4 py-2 text-left text-purple-600">Voucher Code</th>
            <th className="px-4 py-2 text-left text-purple-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {voucherData.map((voucher) => (
            <tr key={voucher.voucherId} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3">{voucher.eventName}</td>
              <td className="px-4 py-3">{voucher.voucherCode}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    voucher.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {voucher.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No voucher data available</p>
            )}
        </div>
      </div>
    </div>
  </section>
)}

             

{activePanel === "profile" && data?.profile && (
      <section className="profile-section bg-gray-50 p-8 rounded-lg shadow-lg">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-purple-600">Profile Settings</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Profile Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-purple-600 mb-4">Personal Information</h3>
            <form onSubmit={handleUpdateProfile}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Website */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Website</label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm"
                  placeholder="Enter your website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {/* Profile Picture Upload */}
<div className="mb-4">
  <label className="block text-gray-700 text-sm font-semibold mb-2">Profile Picture</label>
  <img
    src={profilePicture ? URL.createObjectURL(profilePicture) : data.profile.photoProfileUrl || "/path/to/default-image.jpg"}
    alt="Profile"
    className="w-16 h-16 rounded-full mb-4"
  />
  <input
    type="file"
    className="w-full px-4 py-2 border rounded-lg shadow-sm"
    onChange={(e) => {
      if (e.target.files) {
        setProfilePicture(e.target.files[0]); 
      }
    }}
  />
</div>


              {/* Save Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
              >
                Save Changes
              </button>
        </form>
      </div>

      {/* Right Side: Account Settings & Preferences */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-purple-600 mb-4">
          Account Settings
        </h3>
        <form>
          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg shadow-sm"
              placeholder="Enter a new password"
            />
          </div>

          {/* Social Media Links */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Social Media</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg shadow-sm mb-2"
              placeholder="Instagram Link"
              defaultValue={data.profile.socialMedia?.instagram}
            />
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg shadow-sm"
              placeholder="LinkedIn Link"
              defaultValue={data.profile.socialMedia?.linkedin}
            />
          </div>

          {/* Language Preference */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Language Preference</label>
            <select
              className="w-full px-4 py-2 border rounded-lg shadow-sm"
              defaultValue={data.profile.languagePreference}
            >
              <option value="en">English</option>
              <option value="id">Indonesian</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  </section>
)}


           {/* Help Panel */}
           {activePanel === 'help' && (
            <section className="help-section bg-gray-50 p-8 rounded-lg shadow-lg">
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-purple-600">Help Center</h2>
              
            </header>
          
            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Left Column: FAQ */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-purple-600 mb-4">Frequently Asked Questions</h3>
                <ul className="space-y-4">
                  <li className="text-gray-700 hover:underline cursor-pointer">How do I create an event?</li>
                  <li className="text-gray-700 hover:underline cursor-pointer">How can I reset my password?</li>
                  <li className="text-gray-700 hover:underline cursor-pointer">What is the refund policy?</li>
                  <li className="text-gray-700 hover:underline cursor-pointer">How do I cancel my subscription?</li>
                </ul>
              </div>
          
              {/* Center Column: How-to Guides & Troubleshooting */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-purple-600 mb-4">How-to Guides</h3>
                <ul className="space-y-4">
                  <li className="text-gray-700 hover:underline cursor-pointer">Creating Your First Event</li>
                  <li className="text-gray-700 hover:underline cursor-pointer">Managing Ticket Sales</li>
                  <li className="text-gray-700 hover:underline cursor-pointer">Understanding Analytics</li>
                </ul>
          
                <h3 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">Troubleshooting</h3>
                <ul className="space-y-4">
                  <li className="text-gray-700 hover:underline cursor-pointer">What to do if your event does not load</li>
                  <li className="text-gray-700 hover:underline cursor-pointer">Fixing payment errors</li>
                  <li className="text-gray-700 hover:underline cursor-pointer">How to recover a lost password</li>
                </ul>
              </div>
          
              {/* Right Column: Contact Support & Live Chat */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-purple-600 mb-4">Contact Support</h3>
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-2 border rounded-lg shadow-sm" placeholder="Enter your email" />
                  </div>
          
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Message</label>
                    <textarea
                      className="w-full px-4 py-2 border rounded-lg shadow-sm"
                      placeholder="Describe your issue"
                      rows={4}
                    ></textarea>
                  </div>
          
                  <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg">Submit</button>
                </form>
          
                {/* Live Chat */}
                <div className="mt-8">
                  <button className="bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">Start Live Chat</button>
                </div>
              </div>
            </div>
          
            {/* System Status & Links to Documentation */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h3 className="text-2xl font-semibold text-purple-600 mb-4">System Status</h3>
              <p className="text-gray-700">All systems are operational</p>
          
              <h3 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">Documentation</h3>
              <ul className="space-y-4">
                <li className="text-gray-700 hover:underline cursor-pointer">Platform Documentation</li>
                <li className="text-gray-700 hover:underline cursor-pointer">API Reference</li>
                <li className="text-gray-700 hover:underline cursor-pointer">Event Management Guide</li>
              </ul>
            </div>
          </section>
          
          )}
          
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OrganizerDashboard;
