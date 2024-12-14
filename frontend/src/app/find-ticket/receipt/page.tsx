"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Define types based on the structure of your data
interface EventDetails {
  title: string;
  dateTimeStart: string;
}

interface UserDetails {
  name: string;
  email: string;
}

interface PaymentDetails {
  status: string;
  method: string;
  amountPaid: string;
  paymentDate: string;
}

const ConfirmationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get("id");
  const quantity = parseInt(searchParams.get("quantity") || "0");
  const transactionId = searchParams.get("transactionId");
  const voucher = parseInt(searchParams.get("voucher") || "0");
  const points = parseInt(searchParams.get("points") || "0");
  const fee = parseFloat(searchParams.get("fee") || "0");

  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/events/${eventSlug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setEventDetails(data.data);
      } catch (error) {
        console.error("Failed to fetch event details", error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/user/details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/payment/${transactionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setPaymentDetails(data.data);
      } catch (error) {
        console.error("Failed to fetch payment details", error);
      }
    };

    fetchEventDetails();
    fetchUserDetails();
    fetchPaymentDetails();
  }, [eventSlug, transactionId]);

  const calculateTotal = () => {
    const discountedPrice = (fee - points) * (1 - voucher / 100);
    return Math.max(0, discountedPrice);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-[1440px] mx-auto p-6">
        <div className="receipt max-w-4xl mx-auto space-y-8">
          <div className="text-center my-8">
            <h1 className="text-4xl font-bold text-blue-600">Payment Confirmation</h1>
            <p className="mt-4 text-lg text-gray-700">Thank you for your payment! Below are your transaction details:</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Invoice</h2>
                <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-gray-800">{eventDetails ? eventDetails.title : "Loading..."}</p>
                <p className="text-sm text-gray-500">{eventDetails ? eventDetails.dateTimeStart : "Loading..."}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Event Details</h3>
                <p><strong>Event Name:</strong> {eventDetails ? eventDetails.title : "Loading..."}</p>
                <p><strong>Event Date:</strong> {eventDetails ? eventDetails.dateTimeStart : "Loading..."}</p>
                <p><strong>Quantity:</strong> {quantity}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700">User Information</h3>
                <p><strong>Name:</strong> {userDetails ? userDetails.name : "Loading..."}</p>
                <p><strong>Email:</strong> {userDetails ? userDetails.email : "Loading..."}</p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg space-y-4 my-4">
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Voucher Applied:</span>
                <span>{voucher ? `${voucher}% Off` : '0% Off'}</span>
              </div>
              <div className="flex justify-between">
                <span>Points Used:</span>
                <span>{points ? `${points} Points` : 'No Points Used'}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Event Fee:</span>
                <span>{fee ? fee : 'N/A'}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{Number(fee) * Number(quantity) - (points ? Number(points) : 0)}</span>
              </div>
            </div>

            {paymentDetails && (
              <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium text-gray-700">Payment Details</h3>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span>{paymentDetails.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{paymentDetails.method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>{paymentDetails.amountPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Date:</span>
                  <span>{paymentDetails.paymentDate}</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="text-blue-600 font-semibold hover:underline">Return to Homepage</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConfirmationPage;
