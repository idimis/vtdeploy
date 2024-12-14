"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";


interface Event {
  id: string;
  title: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  location: string;
  locationDetails: string;
  fee: number;
  availableSeats: number;
  bookedSeats: number;
}

const CustomerDashboard: React.FC = () => {
  const [data, setData] = useState<any>({
    upcomingEvents: [],
    pastEvents: [],
    profile: {
      name: '',
      email: '',
      website: '',
      address: '',
      phoneNumber: '',
      photoProfileUrl: ''
    },
  });
  const [activePanel, setActivePanel] = useState("overview");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
 

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("Token: ", token);
    if (!token) {
      alert("You are not logged in!");
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const [responseUpcoming, responsePast, responseProfile] = await Promise.all([
          fetch("http://localhost:8080/api/v1/events/upcoming", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/v1/events/past", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/v1/user/details", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!responseProfile.ok) {
          throw new Error(`Network error: ${responseUpcoming.status} ${responseUpcoming.statusText}`);
        }

        const upcomingEvents = await responseUpcoming.json();
        const pastEvents = await responsePast.json();
        const profileData = await responseProfile.json();

        // Handle empty or missing data gracefully
        setData({
          upcomingEvents: upcomingEvents.data?.content || [],  // default to empty array if no data
          pastEvents: pastEvents.data?.content || [],           // default to empty array if no data
          profile: profileData.data || {                        // default to empty object if no profile data
            name: '',
            email: '',
            website: '',
            address: '',
            phoneNumber: '',
            photoProfileUrl: ''
          },
        });

        setName(profileData.data?.name || "");
        setEmail(profileData.data?.email || "");
        setWebsite(profileData.data?.website || "");
        setAddress(profileData.data?.address || "");
        setPhoneNumber(profileData.data?.phoneNumber || "");

      } catch (error: any) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    let photoProfileUrl = data.profile.photoProfileUrl;
    if (profilePicture) {
      try {
        photoProfileUrl = await convertImageToBase64(profilePicture);
      } catch (error: any) {
        console.error("Error converting image:", error);
        alert("Failed to convert image.");
        return;
      }
    }

    const profileData = {
      name,
      email,
      website,
      address,
      phoneNumber,
      photoProfileUrl,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + result.message);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
          <h2 className="text-xl font-bold mb-8">Customer Dashboard</h2>
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
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "overview" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              Overview
            </li>
            <li
              onClick={() => setActivePanel("events")}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "events" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              My Events
            </li>
            <li
              onClick={() => setActivePanel("rewards")}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "rewards" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              Rewards
            </li>
            <li
              onClick={() => setActivePanel("profile")}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "profile" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              Profile
            </li>
            <li
              onClick={() => setActivePanel("help")}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "help" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              Help
            </li>
            <li
              onClick={handleLogout}
              className="cursor-pointer p-2 rounded-lg hover:bg-blue-600"
            >
              Logout
            </li>
          </ul>
        </aside>
  
        {/* Mobile Navigation (Horizontal) */}
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
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "overview" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              Overview
            </li>
            <li
              onClick={() => setActivePanel("events")}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "events" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              My Events
            </li>
            <li
              onClick={() => setActivePanel("rewards")}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "rewards" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              Rewards
            </li>
            <li
              onClick={() => setActivePanel("profile")}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "profile" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              Profile
            </li>
            <li
              onClick={() => setActivePanel("help")}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ease-in-out ${
                activePanel === "help" ? "bg-blue-700" : "hover:bg-blue-600 hover:scale-105"
              }`}
            >
              Help
            </li>
          </ul>
        </div>
  
           {/* Main Content */}
<main className="flex-grow p-8 overflow-y-auto">
  {activePanel === "overview" && (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="flex gap-8">
        <div className="w-2/3">
          <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
          <ul>
            {data.upcomingEvents.length > 0 ? (
              data.upcomingEvents.map((event: Event) => (
                <li key={event.id} className="p-4 border-b flex justify-between items-center">
                  {/* Grid for text alignment */}
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col">
                      <h4 className="font-regular">{event.title}</h4>
                    </div>
                    <div className="flex flex-col text-center">
                      <p>{new Date(event.dateTimeStart).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col text-left">
                      <p>Location: {event.location}</p>
                    </div>
                  </div>
                  <Link
                    href={`/events/${event.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}/review`}
                  >
                    <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-3 px-6 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                      Leave a Review
                    </button>
                  </Link>
                </li>
              ))
            ) : (
              <p>No upcoming events available.</p>
            )}
          </ul>

          <h3 className="text-xl font-semibold mb-4 mt-8">Past Events</h3>
          <ul>
            {data.pastEvents.length > 0 ? (
              data.pastEvents.map((event: Event) => (
                <li key={event.id} className="p-4 border-b flex justify-between items-center">
                  {/* Grid for text alignment */}
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col">
                      <h4 className="">{event.title}</h4>
                    </div>
                    <div className="flex flex-col text-center">
                      <p>{new Date(event.dateTimeStart).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col text-left">
                      <p>Location: {event.location}</p>
                    </div>
                  </div>
                  <Link
                    href={`/events/${event.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}/review`}
                  >
                    <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-3 px-6 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                      Leave a Review
                    </button>
                  </Link>
                </li>
              ))
            ) : (
              <p>No past events available.</p>
            )}
          </ul>
        </div>

        {/* Right: Customer Profile */}
<div className="w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
  <h3 className="text-2xl font-semibold text-purple-600 mb-4">Customer Profile</h3>
  <div className="flex items-center gap-4">
    <div className="w-20 h-20 rounded-full overflow-hidden">
      <Image
        src={data.profile.photoProfileUrl || "/path/to/default-image.jpg"}
        alt="Customer Photo"
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
        Email: {data.profile.email}
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
    </section>
          )}


{activePanel === 'events' && (
  <section className="event-section bg-gray-50 p-8 rounded-lg shadow-lg">
    <header className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-semibold text-purple-600">Your Upcoming Events</h2>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-purple-600 mb-4">Upcoming Events</h3>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left">Event Name</th>
              <th className="text-left">Date</th>
              <th className="text-left">Status</th>
              <th className="text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.upcomingEvents.length > 0 ? (
              data.upcomingEvents.map((event: Event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.dateTimeStart).toLocaleDateString()}</td>
                  <td>{event.availableSeats - event.bookedSeats} Seats Available</td>
                  <td>
                    {/* Link to Event Details Page */}
                    <Link
                      key={event.id}
                      href={`/events/${event.title.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <button className="bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center">No upcoming events.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Event Statistics */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-2xl font-semibold text-purple-600 mb-4">Event Statistics</h3>
  <div className="grid grid-cols-2 gap-6">
    <div className="stat-box bg-purple-100 p-4 rounded-lg">
      <h4 className="text-lg font-semibold">Total Attendees</h4>
      <p className="text-2xl font-bold">
        {data.upcomingEvents.reduce(
          (total: number, event: Event) => 
            total + (event.availableSeats - event.bookedSeats),
          0 
        )}
      </p>
    </div>
    <div className="stat-box bg-purple-100 p-4 rounded-lg">
      <h4 className="text-lg font-semibold">Total Events</h4>
      <p className="text-2xl font-bold">{data.upcomingEvents.length}</p>
    </div>
  </div>
</div>
    </div>
  </section>
)}

{activePanel === 'rewards' && (
<section className="rewards-section bg-gray-50 p-6 rounded-lg shadow-md">
  <header className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-semibold text-purple-600">Your Referral & Rewards</h2>
  </header>

  {/* Referral Code Display with Copy Button */}
  <div className="flex items-center bg-white p-4 rounded-lg shadow-sm mb-6">
    <span className="text-lg text-gray-700 font-semibold">{data.profile?.referralCode || "No Code Available"}</span>
    <button
      className="ml-4 bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-3 px-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center"
      onClick={() => navigator.clipboard.writeText(data.profile?.referralCode || "")}
    >
      <span>Copy</span>
      <svg
        className="ml-2 w-5 h-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h8M8 12h8m-6-4h6" />
      </svg>
    </button>
  </div>

  {/* Referral Link Display with Copy Button */}
  <div className="flex items-center bg-white p-4 rounded-lg shadow-sm mb-6">
      <span className="text-lg text-gray-700 font-semibold">
        {data.profile?.referralCode && 
          `Link: https://vibetribe.vercel.app/signup?referralCode=${data.profile?.referralCode}`} 
        { !data.profile?.referralCode && "No Referral Link Available"} 
      </span>
      <button
        className="ml-4 bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-3 px-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex items-center"
        onClick={() => navigator.clipboard.writeText(data.profile?.referralCode ? `localhost:3000/signup?referralCode=${data.profile?.referralCode}` : "")}
        

      >
        <span>Copy Link</span>
        <svg
          className="ml-2 w-5 h-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h8M8 12h8m-6-4h6" />
        </svg>
      </button>
    </div>

  {/* Points & Voucher List */}
  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h3 className="text-xl font-semibold text-purple-600 mb-2">Your Rewards</h3>
    <div className="flex justify-between mb-2">
      <span className="text-gray-700">Points Balance:</span>
      <span className="text-gray-800">{data.profile?.pointsBalance || 0} Points</span>
    </div>
    <div className="flex justify-between mb-2">
      <span className="text-gray-700">Voucher:</span>
      <span className="text-gray-800">10% Off</span>
    </div>
  </div>

  {/* Referral User List */}
  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h3 className="text-xl font-semibold text-purple-600 mb-2">People Using Your Referral</h3>
    <ul>
      
      <li className="flex justify-between text-gray-700 mb-2">
        <span>John Doe</span> <span>2024-11-15</span>
      </li>
      <li className="flex justify-between text-gray-700 mb-2">
        <span>Jane Smith</span> <span>2024-11-14</span>
      </li>
      <li className="flex justify-between text-gray-700 mb-2">
        <span>Michael Brown</span> <span>2024-11-13</span>
      </li>
    </ul>
  </div>

  {/* Reward Chart */}
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold text-purple-600 mb-2">Referral Rewards</h3>
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="text-left">Referrals</th>
          <th className="text-left">Reward</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>5 Referrals</td>
          <td>10% Discount</td>
        </tr>
        <tr>
          <td>100 Referrals</td>
          <td>$50 Credit</td>
        </tr>
        <tr>
          <td>1,000 Referrals</td>
          <td>$500 Credit</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

   )}

    {/* Profile Panel */}
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
      <h2 className="text-3xl font-semibold text-purple-600">Customer Help Center</h2>
      
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
      {/* Left Column: Account Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-purple-600 mb-4">Account Settings</h3>
        <ul className="space-y-4">
          <li className="text-gray-700 hover:underline cursor-pointer">Update Profile</li>
          <li className="text-gray-700 hover:underline cursor-pointer">Change Password</li>
          <li className="text-gray-700 hover:underline cursor-pointer">Billing Information</li>
          <li className="text-gray-700 hover:underline cursor-pointer">Subscription Management</li>
        </ul>
      </div>
  
      {/* Center Column: How-to Guides */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-purple-600 mb-4">How-to Guides</h3>
        <ul className="space-y-4">
          <li className="text-gray-700 hover:underline cursor-pointer">How to Update Your Profile</li>
          <li className="text-gray-700 hover:underline cursor-pointer">How to Manage Subscriptions</li>
          <li className="text-gray-700 hover:underline cursor-pointer">Navigating Your Dashboard</li>
        </ul>
        
        <h3 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">Troubleshooting</h3>
        <ul className="space-y-4">
          <li className="text-gray-700 hover:underline cursor-pointer">Can not Login?</li>
          <li className="text-gray-700 hover:underline cursor-pointer">Payment Issues</li>
          <li className="text-gray-700 hover:underline cursor-pointer">Subscription Billing Questions</li>
        </ul>
      </div>
  
      {/* Right Column: Contact Support */}
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
    
          <button type="submit" className="bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-3 px-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">Submit</button>
        </form>
    
        
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
        <li className="text-gray-700 hover:underline cursor-pointer">Customer Guide</li>
      </ul>
    </div>
      </section>
      )}
          
        </main>
      </div>
      
      
      <Footer />
    </div>
  );
};

export default CustomerDashboard;