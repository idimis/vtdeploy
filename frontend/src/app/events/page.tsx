"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/events");
        const result = await response.json();

        if (result.success) {
          const currentDate = new Date();
          const upcomingEvents = result.data.content.filter(
            (event: any) => new Date(event.dateTimeEnd) > currentDate
          );

          setEvents(upcomingEvents);
          setTotalPages(Math.ceil(upcomingEvents.length / itemsPerPage));
        } else {
          setError(result.message || "Failed to load events.");
        }
      } catch (error) {
        setError("Error fetching events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">All Events</h1>

      {isLoading ? (
        <div className="text-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse border rounded-lg p-4 mb-4"
              style={{ height: "200px" }}
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.title.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="bg-white border rounded-lg p-4 shadow-md transition-transform hover:scale-105">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={400}
                    height={250}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.location}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.dateTimeStart).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    page === currentPage
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventsPage;
