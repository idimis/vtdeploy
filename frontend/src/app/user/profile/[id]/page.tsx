"use client";

import React, { useState, useEffect } from 'react';
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Define the shape of userData
interface SocialMedia {
  twitter: string;
  instagram: string;
  linkedin: string;
}

interface UserData {
  fullName: string;
  email: string;
  website: string;
  profileImageUrl: string;
  bio: string;
  socialMedia: SocialMedia;
  blogs: string[];
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null); // Use the correct type here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const pathname = window.location.pathname;
        console.log('Current pathname:', pathname); 
        const userId = pathname.split('/').pop();
        console.log('User ID:', userId); 

        if (userId) {
          const numericUserId = parseInt(userId);
  
          if (isNaN(numericUserId)) {
            console.error("Invalid userId.");
            return;
          }
  
          const response = await fetch(`${BASE_URL}/api/v1/users/${numericUserId}/details`);
          const data = await response.json();
  
          if (data.success && data.data) {
            setUserData({
              fullName: data.data.fullName || generateRandomName(),
              email: data.data.email || generateRandomEmail(),
              website: data.data.website || "Website not provided",
              profileImageUrl: data.data.photoProfileUrl || generateRandomProfileImage(),
              bio: data.data.bio || generateRandomBio(),
              socialMedia: data.data.socialMedia || generateRandomSocialMedia(),
              blogs: data.data.blogs || generateRandomBlogs(),
            });
          } else {
            console.error("Failed to fetch user details:", data.message);
          }
        } else {
          console.error("UserId is undefined");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDetails();
  }, []);

  const generateRandomName = () => {
    const names = ["Alex Johnson", "Taylor Smith", "Jordan Lee", "Chris Kim"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateRandomEmail = () => {
    const emails = ["user1@example.com", "user2@example.com", "hello@example.com"];
    return emails[Math.floor(Math.random() * emails.length)];
  };

  const generateRandomProfileImage = () => {
    return "https://via.placeholder.com/150";
  };

  const generateRandomBio = () => {
    const bios = [
      "Aspiring artist and coffee lover.",
      "Tech enthusiast with a passion for coding.",
      "Travel blogger exploring the world one step at a time.",
      "Fitness junkie and nutrition advocate."
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  };

  const generateRandomSocialMedia = () => {
    return {
      twitter: "https://twitter.com/randomuser",
      instagram: "https://instagram.com/randomuser",
      linkedin: "https://linkedin.com/in/randomuser"
    };
  };

  const generateRandomBlogs = () => {
    return [
      "Top 5 Tips for Better Time Management",
      "Why Traveling Solo is a Must-Do Experience",
      "How to Stay Motivated in Tough Times"
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <img
              src={userData.profileImageUrl}
              alt="User Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">{userData.fullName}</h2>
          <p className="text-gray-600 mb-4">{userData.email}</p>
          <p className="text-gray-600 mb-6">
            {userData.website ? (
              <a
                href={userData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {userData.website}
              </a>
            ) : (
              "Website not provided"
            )}
          </p>

          <p className="text-gray-600 mb-6">{userData.bio}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-2 px-4 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">Send DM</button>
            <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-2 px-4 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">Send Gift</button>
            <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-2 px-4 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">Poke</button>
            <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-2 px-4 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">Add as Friend</button>
          </div>

          <div className="text-sm text-gray-400">Profile last updated: just now</div>

          <div className="mt-8 text-left">
            <h3 className="text-lg font-semibold mb-4">Blogs</h3>
            <ul className="list-disc list-inside">
              {userData.blogs.map((blog, index) => (
                <li key={index} className="text-gray-600">{blog}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 text-left">
            <h3 className="text-lg font-semibold mb-4">Social Media</h3>
            <ul>
              {Object.entries(userData.socialMedia).map(([key, value]) => (
                <li key={key}>
                  <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
