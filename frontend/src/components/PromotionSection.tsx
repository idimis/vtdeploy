import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StaticImageData } from 'next/image'; 
import discount1 from '@/public/earlybirds.png';
import discount2 from '@/public/christmas.png';
import discount3 from '@/public/newdeals.png';

type Promotion = {
  id: string;
  title: string;
  description: string;
  discount: string;
  imageUrl: StaticImageData; 
  link: string;
};

const promotions: Promotion[] = [
  {
    id: '18',
    title: 'Early Bird Access',
    description: 'Get 25% off our latest events. Limited spots!',
    discount: '25% OFF',
    imageUrl: discount1,  
    link: '/events/yogyakarta-puppet-show',
  },
  {
    id: 'promo2',
    title: 'Exclusive Member Deal',
    description: 'Special savings for our loyal members.',
    discount: '30% OFF',
    imageUrl: discount2,  
    link: '/events/bandung-christmas-lights',
  },
  {
    id: 'promo3',
    title: 'Newcomers Special',
    description: 'First time? Enjoy this limited-time offer!',
    discount: 'Up to 35% OFF',
    imageUrl: discount3,  
    link: '/events/jakarta-food-festival',
  },
];

const PromotionSection: React.FC = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-purple-600 text-center mb-8">
        Hot Promotions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {promotions.map((promo) => (
          <Link key={promo.id} href={promo.link} passHref>
            <div className="relative cursor-pointer bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105">
              {/* Image Container */}
              <div className="relative h-64 group"> {/* Increased height here */}
                <Image
                  src={promo.imageUrl} 
                  alt={promo.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                />
                {/* Hover Description */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-2xl font-semibold mb-2">{promo.title}</h3>
                  <p className="text-lg mb-4">{promo.description}</p>
                  <span className="bg-purple-600 px-4 py-2 rounded-full font-bold">
                    {promo.discount}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PromotionSection;
