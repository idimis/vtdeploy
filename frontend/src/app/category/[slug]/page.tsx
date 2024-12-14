"use client";

import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Event {
  id: number;
  image_url: string;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  fee: number;
}

const fetchEventsByCategory = async (category: string): Promise<Event[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const encodedCategory = encodeURIComponent(category);

  const res = await fetch(`${baseUrl}/api/v1/events?category=${encodedCategory}`);
  const data = await res.json();

  if (!res.ok) throw new Error(`Failed to fetch events: ${data.message || "Unknown error"}`);
  return data.data.content;
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const slugToCategoryMap: { [key: string]: string } = {
    music: "Music",
    nightlife: "Nightlife",
    "performance-arts": "Performance & Arts",
    holiday: "Holiday",
    "food-drink": "Food & Drink",
  };

  const slug = params.slug;

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      if (!slug) return;
      const categoryName = slugToCategoryMap[slug];

      if (!categoryName) {
        notFound();
        return;
      }

      try {
        const fetchedEvents = await fetchEventsByCategory(categoryName);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryEvents();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!slug || !events.length) {
    return <div>No events found for this category.</div>;
  }

  return (
    <div>
      <Header />
      <main className="max-w-[1440px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{slugToCategoryMap[slug]} Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event: Event) => {
            const eventSlug = event.title.toLowerCase().replace(/\s+/g, "-");

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

export default CategoryPage;
