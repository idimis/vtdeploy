"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface EventPageProps {
  params: { slug: string };
}

interface User {
  role: string;
}

interface Organizer {
  userId: number;
  fullName: string;
  email: string;
  website?: string;
  photoProfileUrl?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const EventPage: React.FC<EventPageProps> = ({ params }) => {
  const [slug, setSlug] = useState<string>("");
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const { user } = useAuth() as { user: User | null }; // Properly type the context

  useEffect(() => {
    const fetchSlug = async () => {
      const paramsData = await params;
      setSlug(paramsData.slug || "");
    };
    fetchSlug();
  }, [params]);

  useEffect(() => {
    const fetchEventFromTitle = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/v1/events/${slug}`);
        const data = await response.json();

        if (data.success && data.data) {
          setEvent(data.data);
          if (data.data.organizerId) {
            fetchOrganizerDetails(data.data.organizerId);
          } else {
            console.error("Organizer ID is missing.");
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    const fetchOrganizerDetails = async (organizerId: number) => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/users/${organizerId}/details`);
        const data = await response.json();
        if (data.success && data.data) {
          setOrganizer(data.data);
        } else {
          console.error("Failed to fetch organizer details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching organizer details:", error);
      }
    };

    if (slug) {
      fetchEventFromTitle();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Loading...</div>;
  }

  if (!event) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Event not found</div>;
  }

  const eventSlug = event.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mx-auto p-6">
        <div className="event-detail max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:space-x-8 justify-center items-center">
            <div className="flex-2 md:w-2/3 space-y-4">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-96 object-cover rounded-lg shadow-md mx-auto"
              />
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold text-gray-800">{event.title}</h1>
                <p className="text-gray-500 text-sm">
                  <span className="font-medium">Category: </span>
                  {event.category}
                </p>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center text-gray-600">
                  <p>
                    <span className="font-medium">Date: </span>
                    {formatDate(event.dateTimeStart)}
                  </p>
                  <p>
                    <span className="font-medium">Time: </span>
                    {formatTime(event.dateTimeStart)} - {formatTime(event.dateTimeEnd)}
                  </p>
                </div>
                <div className="text-gray-600">
                  <p>
                    <span className="font-medium">Location: </span>
                    {event.location} ({event.locationDetails})
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-center">
                  {user && user.role === "organizer" ? (
                    <Link href={`/events/${eventSlug}/edit`}>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit Event
                      </button>
                    </Link>
                  ) : (
                    <Link href={`/events/${eventSlug}/payment`}>
                      <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-3 px-6 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                        Buy This Ticket
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12"></div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Organizer Details</h2>
            {organizer ? (
              <div className="flex flex-col space-y-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                {organizer.photoProfileUrl ? (
                  <img
                    src={organizer.photoProfileUrl}
                    alt={organizer.fullName}
                    className="w-24 h-24 object-cover rounded-full shadow-md ml-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 rounded-full ml-0"></div>
                )}
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Organizer Name: </span>
                  {organizer.fullName || "Name Not Available"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Email: </span>
                  {organizer.email || "Email Not Available"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Website: </span>
                  <a
                    href={organizer.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    {organizer.website || "Website Not Available"}
                  </a>
                </p>
                <div className="flex space-x-4">
                  <button className="bg-gradient-to-r from-gray-400 to-gray-400 text-white py-1 px-2 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                    Send Message
                  </button>
                  <button className="bg-gradient-to-r from-gray-400 to-gray-400 text-white py-1 px-2 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                    Add As Friend
                  </button>
                  <Link href={`/user/profile/${organizer.userId}`} passHref>
                    <button className="bg-gradient-to-r from-gray-400 to-gray-400 text-white py-1 px-2 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                      Go to Organizer Profile
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <p>Loading organizer details...</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventPage;
