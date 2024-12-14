"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/logo2.png';
import danceImage from '@/public/dance.jpg';

import Footer from '@/components/Footer';

const Logout: React.FC = () => {

  useEffect(() => {
    // Clear any necessary data when logging out (for example, localStorage)
    localStorage.removeItem('user');
    // You could also redirect the user after a certain time if desired
    setTimeout(() => {
      window.location.href = '/'; // Redirect to homepage after logout
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-light-gray">
     
      <div className="flex flex-col lg:flex-row flex-grow">
        <div className="relative w-full lg:w-1/2">
          <Image
            src={danceImage}
            alt="Logout Background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
          <Image src={Logo} alt="Logo" width={120} height={120} className="mb-4" />
          <h1 className="text-4xl font-bold text-purple-600 mb-4 text-center">
            Thank You for Visiting!
          </h1>
          <p className="text-xl text-center text-gray-700 mb-4">
            We hope to see you again soon. Your session has been logged out.
          </p>
          <p className="text-center text-gray-500">
            You will be redirected shortly, or you can{' '}
            <Link href="/" className="text-blue-600 underline">click here</Link> to return home.
          </p>

          <div className="text-center mt-8">
            <p className="text-gray-600">Take care and stay tuned for future visits!</p>
          </div>
        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default Logout;
