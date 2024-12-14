"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import EventCategory from '@/components/EventCategory';
import EventNearby from '@/components/EventNearby';
import MoreEvents from '@/components/MoreEvents';
import WhereToNext from '@/components/WheretoNext';
import PromotionSection from '@/components/PromotionSection';
import PopupReview from '@/components/PopupReview';
import NewestEvent from '@/components/NewestEvent';


const Page: React.FC = () => {
  return (
      <div>
        <Header />
        <Carousel />
        <EventCategory />
        <PromotionSection />
        <NewestEvent />
        <PopupReview />
        <EventNearby />
        <WhereToNext />
        <MoreEvents />
        <Footer />
      </div>
  );
};

export default Page;
