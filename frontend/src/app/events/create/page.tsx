"use client";
import EventImage from "@/public/concert.jpg";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/public/logo2.png";
import Image from "next/image";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const CreateEvent: React.FC = () => {
  const router = useRouter();
  const { getJwtToken } = useAuth();
  const [step, setStep] = useState(1); 
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    dateTimeStart: "",
    dateTimeEnd: "",
    location: "",
    locationDetails: "",
    category: "",
    fee: "",
    availableSeats: "",
    imageUrl: "", 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
  
    const token = getJwtToken();
  
    try {
      const response = await fetch(`${BASE_URL}/api/v1/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Event created successfully!");
        router.push(`/dashboard/organizer`);
      } else {
        setError(result.message || "An error occurred while creating the event.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => setStep(2);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <header className="mb-8 text-center">
        <Image src={Logo} alt="Logo" width={120} height={60} className="mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Create Event</h1>
      </header>
      {step === 1 ? (
        <section className="flex flex-col items-center bg-white rounded-lg p-6 w-full max-w-full md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%]">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4 text-center">Where Event Organizers Grow</h1>
          <p className="text-gray-700 text-center mb-6">
            The all-in-one ticketing and discovery platform trusted by millions of organizers and attendees worldwide.
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold text-purple-500 mb-4 text-center">You Are Free To Grow</h2>
          <p className="text-gray-700 mb-6 text-center">
            It’s free to publish unlimited events and sell unlimited tickets.
          </p>

          <h3 className="text-xl md:text-2xl font-semibold text-purple-500 mb-4 text-center">Launch Your Next Event</h3>
          <p className="text-gray-700 text-center mb-6">
            Event hosting made easy. Easily create events for free on a platform that attendees love and trust.
          </p>

          <div className="relative mb-6 w-full">
            <Image src={EventImage} alt="Event Example" layout="responsive" width={500} height={300} className="rounded-lg" />
          </div>

          <button
            onClick={handleNextStep}
            className="bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            Create Event
          </button>
        </section>
      ) : (
        <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-lg space-y-6">
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <input
                id="description"
                type="text"
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateTimeStart" className="block text-sm font-medium text-gray-700">Start Date & Time</label>
              <input
                id="dateTimeStart"
                type="datetime-local"
                name="dateTimeStart"
                value={eventData.dateTimeStart}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateTimeEnd" className="block text-sm font-medium text-gray-700">End Date & Time</label>
              <input
                id="dateTimeEnd"
                type="datetime-local"
                name="dateTimeEnd"
                value={eventData.dateTimeEnd}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="locationDetails" className="block text-sm font-medium text-gray-700">Location Details</label>
              <input
                id="locationDetails"
                type="text"
                name="locationDetails"
                value={eventData.locationDetails}
                onChange={handleInputChange}
                placeholder="Enter location details"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input
                id="category"
                type="text"
                name="category"
                value={eventData.category}
                onChange={handleInputChange}
                placeholder="Enter event category"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Fee</label>
              <input
                id="fee"
                type="number"
                name="fee"
                value={eventData.fee}
                onChange={handleInputChange}
                placeholder="Enter event fee"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">Available Seats</label>
              <input
                id="availableSeats"
                type="number"
                name="availableSeats"
                value={eventData.availableSeats}
                onChange={handleInputChange}
                placeholder="Enter number of available seats"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Event Image URL</label>
              <input
                id="imageUrl"
                type="text"
                name="imageUrl"
                value={eventData.imageUrl}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-indigo-500 text-white rounded-lg disabled:bg-gray-400"
          >
            {isLoading ? "Creating..." : "Confirm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
