"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ReviewPageProps {
  params: { slug: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const ReviewPage: React.FC<ReviewPageProps> = ({ params }) => {
  const { isLoggedIn, getJwtToken } = useAuth();
  const [slug, setSlug] = useState<string>("");
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [eventId, setEventId] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [hasPurchasedTicket, setHasPurchasedTicket] = useState<boolean>(false);

  useEffect(() => {
    const fetchSlug = async () => {
      const paramsData = await params;
      setSlug(paramsData.slug || '');
    };
    fetchSlug();
  }, [params]);
  
  useEffect(() => {
    const fetchEventFromSlug = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/v1/events/${slug}`);
        const data = await response.json();

        if (data.success && data.data) {
          setEvent(data.data);
          setEventId(data.data.id); 
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEventFromSlug();
    }
  }, [slug]);


  const checkTicketStatus = async () => {
    try {
      const token = getJwtToken();
      const response = await fetch(`${BASE_URL}/api/v1/tickets/past`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success && data.data.content) {
        const hasTicket = data.data.content.some(
          (ticket: any) => ticket.eventId === eventId && ticket.status === "VALID"
        );
        setHasPurchasedTicket(hasTicket);
      } else {
        setHasPurchasedTicket(false);
      }
    } catch (error) {
      console.error("Error checking ticket status:", error);
      setHasPurchasedTicket(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && eventId) {
      checkTicketStatus();
    }
  }, [isLoggedIn, eventId]);

  const handleConfirmReview = async () => {
    if (!hasPurchasedTicket) {
      alert("You can only review events you have attended.");
      return;
    }

    if (!event?.id || !reviewText.trim() || rating === 0) {
      alert("Please provide a valid review and rating.");
      return;
    }

    try {
      const token = getJwtToken();
      const response = await fetch(`${BASE_URL}/api/v1/events/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event.id,
          review: reviewText,
          rating,
          feedback: feedbackText,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Review submitted successfully!");
        setReviewText("");
        setRating(0);
        setFeedbackText("");
      } else {
        console.error("Review submission failed:", data.message);
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Review submission failed:", error);
      alert("An error occurred while submitting the review.");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto py-8 px-4 lg:px-8 bg-gray-50 shadow-lg rounded-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {event.title}
        </h1>
        <p className="text-center text-gray-600 text-lg mb-8">
          We value your feedback! Please leave your thoughts below.
        </p>

        <div className="flex flex-col items-center mb-8">
          <p className="text-gray-700 text-lg mb-3">Rate this event:</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`cursor-pointer text-4xl transition-transform duration-200 ${
                  (hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-300"
                } hover:scale-125`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {rating ? `You rated this event ${rating}/5` : "Hover over the stars to rate"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Write Your Review</h2>
          <textarea
            className="w-full border border-gray-300 p-4 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
          <textarea
            className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Any additional feedback for the organizers?"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 shadow-md"
            onClick={handleConfirmReview}
          >
            Submit Review
          </button>
          <button
            className="bg-gray-300 text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-400 transition duration-200 shadow-md"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewPage;
