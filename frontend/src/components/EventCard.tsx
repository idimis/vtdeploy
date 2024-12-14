"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Event {
  id: number;
  image_url: string;
  title: string;
  date: string;
  location: string;
  category: string;
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/events/${event.id}`);
  };

  return (
    <div
      className="border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
      onClick={handleCardClick}
    >
      <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover rounded-md" />
      <h3 className="text-lg font-bold mt-2">{event.title}</h3>
      <p className="text-sm text-gray-600">{event.date}</p>
      <p className="text-sm text-gray-600">{event.location}</p>
    </div>
  );
};

export default EventCard;
