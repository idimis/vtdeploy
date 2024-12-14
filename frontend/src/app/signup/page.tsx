"use client";

import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Logo from '@/public/logo2.png';
import danceImage from '@/public/dance.jpg';


const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'organizer'>('customer');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    // Get referral code from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const urlReferralCode = urlParams.get('referralCode');
    
    if (urlReferralCode) {
      setReferralCode(urlReferralCode);  // Set referralCode if found in the URL
    }

    // Reset form fields
    setEmail('');
    setPassword('');
    setRole('customer');
    setWebsite('');
    setPhoneNumber('');
    setAddress('');
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          website,
          phoneNumber,
          address,
          referralCode: referralCode || undefined,  // Send referralCode if it's set
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Signup failed:', errorDetails);
        throw new Error(`Signup failed: ${errorDetails}`);
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data));
        setShowSuccessPopup(true); // Show success popup
        setTimeout(() => {
          setShowSuccessPopup(false);
          window.location.href = '/login'; // Redirect after 3 seconds
        }, 3000);
      } else {
        throw new Error('Server did not return JSON');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-light-gray">
        <div className="relative w-full lg:w-1/2">
          <Image
            src={danceImage}
            alt="Signup Background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
          <Image src={Logo} alt="Logo" width={120} height={120} className="mb-4" />
          <h1 className="text-4xl font-bold text-purple-600 mb-4 text-center">Create an Account</h1>

          <form onSubmit={handleSignup} className="w-full max-w-xs">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Referral Code (optional)"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}  // Allow manual entry
            />

            <div className="flex justify-between mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                  className="mr-2"
                />
                Customer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="organizer"
                  checked={role === 'organizer'}
                  onChange={() => setRole('organizer')}
                  className="mr-2"
                />
                Organizer
              </label>
            </div>

            {role === 'organizer' && (
              <>
                <input
                  type="text"
                  placeholder="Website"
                  className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-800 transition duration-300 w-full mb-4"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Account Created Successfully!</h2>
            <p className="text-gray-600">You will be redirected to the login page shortly.</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Signup;
