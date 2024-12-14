'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Logo from '@/public/logo2.png';
import artsImage from '@/public/arts.jpg';
import Link from 'next/link';

const FindTicketPage: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('You are not logged in!');
      window.location.href = '/login';
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/events/upcoming', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        if (data.success) {
          setEvents(data.data.content);
        } else {
          alert('No upcoming events found.');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        alert('An error occurred while fetching events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  return (
    <>
      <div className="min-h-screen bg-light-gray">
        <Header />
        {/* Background Image */}
        <div className="relative w-full h-80">
          <Image 
            src={artsImage} 
            alt="Upcoming Events Background"
            layout="fill" 
            objectFit="cover" 
            className="absolute inset-0"
          />
        </div>

        {/* Events Section */}
        <div className="flex flex-col items-center justify-center p-8 lg:p-16">
          <Image src={Logo} alt="Logo" width={120} height={120} className="mb-4" />
          <h1 className="text-3xl lg:text-4xl font-bold text-purple-600 mb-6 text-center">
            Your Event Tickets
          </h1>

          {loading ? (
            <p className="text-gray-700">Loading upcoming events...</p>
          ) : (
            <div className="w-full">
              {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event: any) => (
                    <Link 
                      key={event.id} 
                      href={`/events/${generateSlug(event.title)}`} 
                      className="block p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-all"
                    >
                      <Image 
                        src={event.imageUrl} 
                        alt={event.title} 
                        width={500} 
                        height={300} 
                        className="mb-4 rounded-md"
                      />
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p>{event.description}</p>
                      <p><strong>Start:</strong> {new Date(event.dateTimeStart).toLocaleString()}</p>
                      <p><strong>End:</strong> {new Date(event.dateTimeEnd).toLocaleString()}</p>
                      <p><strong>Location:</strong> {event.location} - {event.locationDetails}</p>
                      <p><strong>Category:</strong> {event.category}</p>
                      <p><strong>Fee:</strong> {event.fee ? `Rp ${event.fee.toLocaleString()}` : 'Free'}</p>
                      <p><strong>Available Seats:</strong> {event.availableSeats - event.bookedSeats}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>No upcoming events found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FindTicketPage;
