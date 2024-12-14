"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import jakartaImage from '@/public/cities/jakarta.jpeg';
import baliImage from '@/public/cities/bali.jpg';
import yogyakartaImage from '@/public/cities/yogyakarta.jpg';
import bandungImage from '@/public/cities/bandung.webp';
import surabayaImage from '@/public/cities/surabaya.jpg';
import lombokImage from '@/public/cities/lombok.webp';
import medanImage from '@/public/cities/medan.jpg';
import surakartaImage from '@/public/cities/surakarta.png';
import semarangImage from '@/public/cities/semarang.jpg';
import malangImage from '@/public/cities/malang.jpg';

const cities = [
  { name: "Jakarta", image: jakartaImage, slug: "jakarta" },
  { name: "Bali", image: baliImage, slug: "bali" },
  { name: "Yogyakarta", image: yogyakartaImage, slug: "yogyakarta" },
  { name: "Bandung", image: bandungImage, slug: "bandung" },
  { name: "Surabaya", image: surabayaImage, slug: "surabaya" },
  { name: "Lombok", image: lombokImage, slug: "lombok" },
  { name: "Medan", image: medanImage, slug: "medan" },
  { name: "Surakarta", image: surakartaImage, slug: "surakarta" }, 
  { name: "Semarang", image: semarangImage, slug: "semarang" },
  { name: "Malang", image: malangImage, slug: "malang" },
];

const WhereToNext: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cities.length);
    }, 3000); 
    return () => clearInterval(interval); 
  }, []);

  const extendedCities = [...cities, ...cities];

  return (
    <div className="flex flex-col items-center w-full py-10">
      <h2 className="text-2xl font-bold mb-6 text-purple-600">Where to Next?</h2>

      <div className="relative w-full max-w-[1440px] overflow-hidden">
        <div
          className="flex animate-slide transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * (100 / cities.length))}%)`,
            display: 'flex',
          }}
        >
          {extendedCities.map((city, index) => (
            <Link key={index} href={`/location/${city.slug}`} passHref> 
              <div className="relative min-w-[200px] max-w-[200px] h-[250px] mx-2 rounded-lg shadow-lg hover:brightness-75 transition duration-300 cursor-pointer">
                <div className="relative w-full h-full"> 
                  <Image
                    src={city.image} 
                    alt={city.name}
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-lg" 
                    priority 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-lg"></div>
                <span className="absolute bottom-4 left-4 text-white font-bold text-lg">{city.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${(100 / cities.length) * cities.length}%); }
        }
        .animate-slide {
          animation: slide 20s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-slide {
            animation: none; /* Disable animation on smaller screens for better performance */
          }
        }
      `}</style>
    </div>
  );
};

export default WhereToNext;