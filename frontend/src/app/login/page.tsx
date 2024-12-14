
"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";  
import Footer from "@/components/Footer";
import Image from "next/image";
import GoogleIcon from "@/public/icons/google.png";
import Logo from "@/public/logo2.png";
import yogaImage from "@/public/yoga.jpg";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext"; 

const LoginContent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const api = {
      login: async (email: string, password: string) => {
        const response = await fetch("http://localhost:8080/api/v1/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed.");
        }

        return response.json();
      },

      getUserDetails: async (token: string) => {
        const response = await fetch("http://localhost:8080/api/v1/user/details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }

        return response.json();
      },
    };

    try {
      const result = await api.login(email, password);
      const token = result.data.accessToken;

      login(token);
      console.log("token = " + token);

      const userDetails = await api.getUserDetails(token);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      

      if (userDetails.data.role.toLowerCase() === "customer") {
        window.location.href = "/dashboard/customer"; 
      } else {
        window.location.href = "/dashboard/organizer"; 
      }

    } catch (err: any) {
      const errorMessage = err.message || "Something went wrong, please try again.";
      console.error("Error during login:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-light-gray">
        <div className="relative w-full lg:w-1/2">
          <Image
            src={yogaImage}
            alt="Login Background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
          <Image src={Logo} alt="Logo" width={120} height={120} className="mb-4" />
          <h1 className="text-4xl font-bold text-purple-600 mb-4 text-center">
            Login to Your Account
          </h1>

          {error && (
            <p className="text-red-500 mb-4 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="w-full max-w-xs">
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
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe" className="text-gray-700">
                Remember Me
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-800 transition duration-300 w-full mb-4"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Confirm"}
            </button>
          </form>
          <p className="text-gray-600 mb-4 text-center">or</p>
          <button className="flex items-center bg-white border border-gray-300 rounded-full py-2 px-4 hover:bg-gray-100 transition duration-300 w-full max-w-xs">
            <Image src={GoogleIcon} alt="Google" width={20} height={20} className="mr-2" />
            Login with Google
          </button>
          <p className="mt-4 text-gray-700 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-600 underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

const Login: React.FC = () => {
  return (
    <AuthProvider> 
      <LoginContent />
    </AuthProvider>
  );
};

export default Login;
