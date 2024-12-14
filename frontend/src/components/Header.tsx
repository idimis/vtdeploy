"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImage from "@/public/logo2.png";
import UserGreeting from "./UserGreetings";
import { useAuth } from '@/context/AuthContext';
import Link from "next/link";

const Header: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<{ id: number; title: string; slug: string }[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showEventSuggestions, setShowEventSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const eventInputRef = useRef<HTMLInputElement>(null);

  const baseUrl = "http://localhost:8080";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isLoggedIn) {
          const response = await fetch(`${baseUrl}/api/v1/user/details`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUsername(data.data.name);
            setRole(data.data.role);
          } else {
            console.error("Failed to fetch user data");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    sessionStorage.clear();
    logout();
    window.location.href = "/";
  };

  const handleLocationChange = useCallback(
    debounce(async (query: string) => {  // specify 'string' for query here
      setLocation(query);
  
      if (query.trim() === '') {
        setFilteredLocations([]);
        setShowLocationSuggestions(false);
        return;
      }
  
      try {
        const response = await fetch(`${baseUrl}/api/v1/locations?search=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.success && data.data) { 
          const lowercaseQuery = query.toLowerCase();
          setFilteredLocations(data.data.filter((location) => {
            const lowerCaseCityName = location.cityName.toLowerCase();
            
            if (lowerCaseCityName === lowercaseQuery) {
              return true; 
            }
            
            return lowerCaseCityName.includes(lowercaseQuery); 
          }));
        } else {
          setFilteredLocations([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setFilteredLocations([]);
      }
      setShowLocationSuggestions(true);
    }, 100),
    []
  );
  

  const handleLocationSelect = (slug: string) => {
    router.push(`/location/${slug}`);
    setLocation("");
    setFilteredLocations([]);
    setShowLocationSuggestions(false);
  };

  const handleSearchQueryChange = useCallback(
    debounce(async (query: string) => {
      setSearchQuery(query); 

      if (query.trim() === '') {
        setFilteredEvents([]);
        setShowEventSuggestions(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/v1/events?search=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success && data.data) {
          const lowercaseQuery = query.toLowerCase();
          const filteredEventsData = data.data.content.filter((event: any) => 
            event.title.toLowerCase().includes(lowercaseQuery) 
          ).map((event: any) => ({
            id: event.id,
            title: event.title,
            slug: event.title.replace(/\s+/g, "-").toLowerCase(),
          }));
          setFilteredEvents(filteredEventsData);
        } else {
          setFilteredEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setFilteredEvents([]);
      }

      setShowEventSuggestions(true);
    }, 100),
    []
  );

  const handleEventSelect = (slug: string) => {
    router.push(`/events/${slug}`);
    setSearchQuery("");
    setFilteredEvents([]);
    setShowEventSuggestions(false);
  };

  return (
    <header className="bg-white text-black shadow-md sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between p-4 md:p-5 flex-col md:flex-row">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Image
            src={logoImage}
            alt="Logo Brand"
            width={150}
            height={150}
            className="object-contain w-[100px] h-[auto]"
          />
        </div>
  
        {/* Search Sections */}
        <div className="flex items-center space-x-4 flex-col md:flex-row">
          {/* Search Location */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Location"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none w-full md:w-64"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              ref={locationInputRef}
            />
            {showLocationSuggestions && (
              <div className="absolute z-10 bg-white shadow-md mt-1">
                <ul className="max-h-48 overflow-y-auto">
                  {filteredLocations.map((location) => (
                    <li
                      key={location.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleLocationSelect(location.cityName.toLowerCase().replace(/\s+/g, '-'))}
                    >
                      {location.cityName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
  
          {/* Search Events */}
          <div className="relative w-full md:w-auto mt-2 md:mt-0">
            <input
              type="text"
              placeholder="Search Events"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none w-full md:w-64"
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              ref={eventInputRef}
            />
            {showEventSuggestions && (
              <div className="absolute z-10 bg-white shadow-md mt-1">
                <ul className="max-h-48 overflow-y-auto">
                  {filteredEvents.map((event) => (
                    <li
                      key={event.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEventSelect(event.slug)}
                    >
                      {event.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

          {/* Dashboard Button */}
          <div className="flex flex-col items-center md:items-start md:flex-row">
                  {role === "organizer" && (
                    <Link href="/dashboard/organizer">
                      <a className="text-blue-600 hover:underline mb-2 md:mb-0">Dashboard</a>
                    </Link>
                  )}
                  {role === "customer" && (
                    <Link href="/dashboard/customer">
                      <a className="text-blue-600 hover:underline mb-2 md:mb-0">Dashboard</a>
                    </Link>
                  )}
                </div>
  
        {/* Authentication and User Greeting */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
              
  
                {/* User Greeting */}
                <UserGreeting username={username} role={role} onLogout={handleLogout} />
              </>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login">
                  <button className="text-black px-4 py-2 rounded-md">Log In</button>
                </Link>
                <Link href="/signup">
                  <button className="text-black px-4 py-2 rounded-md">Sign Up</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
