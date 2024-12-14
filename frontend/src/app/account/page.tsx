"use client"; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

const CreateAccountPage: React.FC = () => {
  const router = useRouter();

  // Role selection state
  const [role, setRole] = useState<'customer' | 'organizer' | null>(null);

  // User form data state
  const [formData, setFormData] = useState<User>({
    name: '',
    dob: '',
    email: '',
    phone: '',
  });

  // Handle role selection
  const handleRoleSelect = (selectedRole: 'customer' | 'organizer') => {
    setRole(selectedRole);
  };

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ ...formData, role }));
    
    // Redirect based on the selected role
    if (role === 'organizer') {
      router.push('/organizer/profile'); 
    } else {
      router.push('/user/profile');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h2>

        {/* Role selection buttons */}
        {!role ? (
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => handleRoleSelect('customer')}
              className="py-3 px-6 border-2 border-black text-black font-semibold rounded-lg hover:bg-blue-500 transition hover:text-white duration-200"
            >
              As Customer
            </button>
            <button
              onClick={() => handleRoleSelect('organizer')}
              className="py-3 px-6 border-2 border-black text-black font-semibold rounded-lg hover:bg-blue-500 transition hover:text-white duration-200"
            >
              As Organizer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-center text-lg font-semibold text-gray-700 mb-4">
              Registering as {role === 'customer' ? 'Customer' : 'Organizer'}
            </p>

            {/* Form fields */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateAccountPage;
