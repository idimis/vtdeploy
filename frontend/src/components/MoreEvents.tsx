"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const MoreEventSection: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(1); 

  
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

  const fetchEvents = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/events/exclude-location?location=Bandung&page=${page}&size=8`
      );
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

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page); 
  };

  return (
    <section className="event-section p-6 max-w-[1440px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">
        More Events
      </h2>

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
                {/* Image or Placeholder */}
                <img
                  src={event.imageUrl}
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
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 mx-2 rounded-lg ${page === currentPage ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default MoreEventSection;
