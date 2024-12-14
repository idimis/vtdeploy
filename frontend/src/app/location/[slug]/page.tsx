"use client";

import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Event {
  id: number;
  imageUrl: string;
  title: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  location: string;
  locationDetails: string;
  category: string;
  description: string;
  fee: number;
  availableSeats: number;
  bookedSeats: number;
  slug: string;
}

const fetchEventsByLocation = async (location: string): Promise<Event[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const encodedLocation = encodeURIComponent(location);

  const res = await fetch(`${baseUrl}/api/v1/events?location=${encodedLocation}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.statusText}`);
  }

  const data = await res.json();
  return data.data.content;
};

interface LocationPageProps {
  params: {
    slug: string;
  };
}

const LocationPage: React.FC<LocationPageProps> = ({ params }) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSlug = async () => {
      const paramsData = await params;
      setSlug(paramsData.slug || null);
    };

    fetchSlug();
  }, [params]);

  useEffect(() => {
    const fetchLocationEvents = async () => {
      if (!slug) return;

      try {
        const fetchedEvents = await fetchEventsByLocation(slug);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationEvents();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!slug || !events.length) {
    return <div>No events found for this location.</div>;
  }

  return (
    <div>
      <Header />
      <main className="max-w-[1440px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          {slug.charAt(0).toUpperCase() + slug.slice(1)} Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event: Event) => {
            const eventSlug = event.slug; 

            return (
              <Link key={event.id} href={`/events/${eventSlug}?id=${event.id}`}>
                <EventCard event={event} />
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;