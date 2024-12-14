"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

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
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `${BASE_URL}/api/v1/events?page=${currentPage - 1}&size=8`; 
        if (filter === "newest") {
          url += `&sortByNewest=true`;
        } else if (filter === "popular") {
          url += `/hottest`;
        } else if (filter === "highestRating") {
          url += `&sortByHighestRating=true`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.success && data.data) {
          setEvents(data.data.content);
          setTotalPages(data.data.totalPages); 
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, currentPage]); 

  return (
    <section className="event-section p-6 max-w-[1440px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">
        {filter === "newest"
          ? "Newest Events"
          : filter === "popular"
          ? "Most Popular Events"
          : "Highest Rated Events"}
      </h2>

      <div className="flex justify-center mb-4">
        <button
          className={`border px-4 py-2 rounded-md mr-2 ${filter === "newest" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("newest")}
        >
          Newest
        </button>
        <button
          className={`border px-4 py-2 rounded-md mr-2 ${filter === "popular" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("popular")}
        >
          Most Popular
        </button>
        <button
          className={`border px-4 py-2 rounded-md ${filter === "highestRating" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("highestRating")}
        >
          Highest Rated
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="event-card bg-gray-200 animate-pulse border rounded-lg p-4"
              style={{ minHeight: "150px", maxHeight: "200px" }}
            >
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          events.map((event: any) => (
            <Link
              key={event.id}
              href={`/events/${event.title.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="event-card bg-white border rounded-lg p-4 shadow-md transition-transform hover:scale-105">
                <img
                  src={event.imageUrl || "/images/default-event-image.jpg"}
                  alt={event.title || "Event Image"}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold">{event.title || "Untitled Event"}</h3>
                <p>{formatDate(event.dateTimeStart) || "No Date Available"}</p>
                <p className="text-sm text-gray-500">
                  {event.locationDetails || "No Address Available"}
                </p>
                {event.dateTimeStart && event.dateTimeEnd && (
                  <p className="text-sm text-gray-500">
                    {formatTime(event.dateTimeStart)} - {formatTime(event.dateTimeEnd)}
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded-md mr-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded-md ml-2"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default EventPage;
