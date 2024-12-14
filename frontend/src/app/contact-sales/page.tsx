"use client";

import React, { useState } from 'react';

const ContactSales: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log({ name, email, phone, message });

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-gray p-8">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">Contact Sales</h1>
      <p className="text-gray-700 text-center mb-6">
        For inquiries about our event management services, please fill out the form below or reach us at sales@example.com.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Type your message here"
            rows={4}
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#FF5A5A] to-[#FF9A9A] text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactSales;
